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

async function selectWithCategoryFallback<T>(table: "products" | "blog_posts", params: Record<string, string | number>) {
  try {
    return (await selectRows(table, params)) as T[];
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const canRetryWithoutCategoryJoin =
      message.includes("categories") ||
      message.includes("relationship") ||
      message.includes("Could not find") ||
      message.includes("does not exist");

    if (!canRetryWithoutCategoryJoin) return [];

    const fallbackParams = { ...params, select: "*" };
    return (await selectRows(table, fallbackParams)) as T[];
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
  const [products, posts] = await Promise.all([
    selectRows("products", { select: "id,status" }, true),
    selectRows("blog_posts", { select: "id,status" }, true),
  ]);
  const allProducts = products as Array<{ status: Status }>;
  const allPosts = posts as Array<{ status: Status }>;

  const totalDrafts = [...allProducts, ...allPosts].filter((item) => item.status === "draft").length;
  const totalPublished = [...allProducts, ...allPosts].filter((item) => item.status === "published").length;

  return {
    totalProducts: allProducts.length,
    totalBlogPosts: allPosts.length,
    totalDrafts,
    totalPublished,
  };
}

export async function getAllAdminProducts() {
  return (await selectRows("products", { select: "*,categories(name,slug)", order: "created_at.desc" }, true)) as Product[];
}

export async function getAllAdminPosts() {
  return (await selectRows("blog_posts", { select: "*,categories(name,slug)", order: "created_at.desc" }, true)) as BlogPost[];
}

export async function getCategories(type?: CategoryType) {
  const params: Record<string, string> = { select: "*", order: "name.asc" };
  if (type) params.type = `eq.${type}`;
  return (await selectRows("categories", params, true)) as Category[];
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
