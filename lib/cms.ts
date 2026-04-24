import { deleteRow, insertRow, selectRows, updateRow } from "@/lib/supabase";

export type Status = "draft" | "published";
export type CategoryType = "product" | "blog";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string;
  full_description: string;
  price: number;
  sale_price: number | null;
  stock: number;
  featured_image: string | null;
  gallery: string[] | null;
  status: Status;
  is_featured: boolean;
  sku: string | null;
  created_at: string;
  categories?: { name: string; slug: string } | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category_id: string | null;
  tags: string[] | null;
  author: string;
  publish_date: string | null;
  status: Status;
  created_at: string;
  categories?: { name: string; slug: string } | null;
};

export type Category = { id: string; name: string; slug: string; type: CategoryType };

export type AdminSummary = {
  totalProducts: number;
  totalBlogPosts: number;
  totalDrafts: number;
  totalPublished: number;
  setupWarning: string | null;
};

function logCmsError(context: string, error: unknown) {
  console.error(`[CMS] ${context}`, error);
}

async function safeSelectRows<T>(table: string, params: Record<string, string | number>, admin = false, context?: string): Promise<T[]> {
  try {
    return (await selectRows(table, params, admin)) as T[];
  } catch (error) {
    logCmsError(context ?? `selectRows(${table}) failed`, error);
    return [];
  }
}

async function selectWithCategoryFallback<T>(table: "products" | "blog_posts", params: Record<string, string | number>) {
  try {
    return (await selectRows(table, params)) as T[];
  } catch (error) {
    logCmsError(`${table} query with category join failed`, error);
    const message = error instanceof Error ? error.message : "";
    const canRetryWithoutCategoryJoin =
      message.includes("categories") ||
      message.includes("relationship") ||
      message.includes("Could not find") ||
      message.includes("does not exist");

    if (!canRetryWithoutCategoryJoin) return [];

    const fallbackParams = { ...params, select: "*" };
    return await safeSelectRows<T>(table, fallbackParams, false, `${table} fallback query failed`);
  }
}

export async function getPublishedProducts() {
  return await selectWithCategoryFallback<Product>("products", {
    select: "*,categories(name,slug)",
    status: "eq.published",
    order: "created_at.desc",
  });
}

export async function getPublishedProductBySlug(slug: string) {
  const rows = await selectWithCategoryFallback<Product>("products", {
    select: "*,categories(name,slug)",
    status: "eq.published",
    slug: `eq.${slug}`,
    limit: 1,
  });
  return rows[0] ?? null;
}

export async function getPublishedPosts() {
  return await selectWithCategoryFallback<BlogPost>("blog_posts", {
    select: "*,categories(name,slug)",
    status: "eq.published",
    order: "publish_date.desc",
  });
}

export async function getPublishedPostBySlug(slug: string) {
  const rows = await selectWithCategoryFallback<BlogPost>("blog_posts", {
    select: "*,categories(name,slug)",
    status: "eq.published",
    slug: `eq.${slug}`,
    limit: 1,
  });
  return rows[0] ?? null;
}

export async function getAdminSummary() {
  const [productsResult, postsResult] = await Promise.allSettled([
    selectRows("products", { select: "id,status" }, true),
    selectRows("blog_posts", { select: "id,status" }, true),
  ]);

  if (productsResult.status === "rejected") {
    logCmsError("admin summary products query failed", productsResult.reason);
  }
  if (postsResult.status === "rejected") {
    logCmsError("admin summary blog_posts query failed", postsResult.reason);
  }

  const allProducts = (productsResult.status === "fulfilled" ? productsResult.value : []) as Array<{ status: Status }>;
  const allPosts = (postsResult.status === "fulfilled" ? postsResult.value : []) as Array<{ status: Status }>;

  const totalDrafts = [...allProducts, ...allPosts].filter((item) => item.status === "draft").length;
  const totalPublished = [...allProducts, ...allPosts].filter((item) => item.status === "published").length;
  const setupWarning =
    productsResult.status === "rejected" || postsResult.status === "rejected"
      ? "Supabase data is unavailable or not fully set up yet. Showing empty totals."
      : null;

  return {
    totalProducts: allProducts.length,
    totalBlogPosts: allPosts.length,
    totalDrafts,
    totalPublished,
    setupWarning,
  };
}

export async function getAllAdminProducts() {
  return await safeSelectRows<Product>(
    "products",
    { select: "*,categories(name,slug)", order: "created_at.desc" },
    true,
    "admin products query failed",
  );
}

export async function getAllAdminPosts() {
  return await safeSelectRows<BlogPost>(
    "blog_posts",
    { select: "*,categories(name,slug)", order: "created_at.desc" },
    true,
    "admin blog posts query failed",
  );
}

export async function getCategories(type?: CategoryType) {
  const params: Record<string, string> = { select: "*", order: "name.asc" };
  if (type) params.type = `eq.${type}`;
  return await safeSelectRows<Category>("categories", params, true, "categories query failed");
}

export async function createProduct(payload: unknown) {
  return (await insertRow("products", payload, true)) as Product;
}

export async function editProduct(id: string, payload: unknown) {
  return (await updateRow("products", id, payload, true)) as Product;
}

export async function removeProduct(id: string) {
  await deleteRow("products", id, true);
}

export async function createPost(payload: unknown) {
  return (await insertRow("blog_posts", payload, true)) as BlogPost;
}

export async function editPost(id: string, payload: unknown) {
  return (await updateRow("blog_posts", id, payload, true)) as BlogPost;
}

export async function removePost(id: string) {
  await deleteRow("blog_posts", id, true);
}

export async function createCategory(payload: unknown) {
  return (await insertRow("categories", payload, true)) as Category;
}

export async function removeCategory(id: string) {
  await deleteRow("categories", id, true);
}
