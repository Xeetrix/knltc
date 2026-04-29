import { deleteRow, insertRow, selectRows, updateRow } from "@/lib/supabase";

export type Status = "draft" | "published";
export type CategoryType = "product" | "blog";

type ProductWritePayload = {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  category?: string | null;
  category_id?: string | null;
  short_description?: string;
  full_description?: string;
  description?: string;
  price?: number;
  sale_price?: number | null;
  stock?: number;
  featured_image?: string | null;
  image_url?: string | null;
  gallery?: string[] | null;
  status?: Status;
  featured?: boolean;
  is_featured?: boolean;
  sku?: string | null;
};

type BlogWritePayload = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string | null;
  cover_image?: string | null;
  cover_image_url?: string | null;
  image_url?: string | null;
  category_id?: string | null;
  tags?: string[] | null;
  author?: string;
  publish_date?: string | null;
  published_at?: string | null;
  status?: Status;
};

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

export type AdminOrdersResult = {
  orders: Order[];
  setupWarning: string | null;
};

export type OrderStatus = "pending" | "confirmed" | "processing" | "delivered" | "cancelled";
export type LeadStatus = "new" | "contacted" | "interested" | "converted" | "lost";
export type ReviewStatus = "pending" | "approved" | "rejected";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  customer_note: string | null;
  total_amount: number;
  delivery_area?: string | null;
  delivery_charge?: number;
  grand_total?: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type ProductReview = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  image_url?: string | null;
  status: ReviewStatus;
  created_at: string;
};

export type CrmLead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: "checkout" | "contact form" | "consultation form" | "manual admin entry";
  interest: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function logCmsError(context: string, error: unknown) {
  console.error(`[CMS] ${context}`, error);
}

function toSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProductPayload(payload: ProductWritePayload) {
  const name = payload.name ?? payload.title ?? "";
  const description = payload.description ?? payload.short_description ?? payload.full_description ?? "";
  const slug = payload.slug?.trim() || toSlug(name);

  return {
    name,
    title: payload.title ?? name,
    slug,
    category: payload.category ?? null,
    category_id: payload.category_id ?? null,
    short_description: payload.short_description ?? description,
    full_description: payload.full_description ?? description,
    description,
    price: payload.price ?? 0,
    sale_price: payload.sale_price ?? null,
    stock: payload.stock ?? 0,
    featured_image: payload.featured_image ?? payload.image_url ?? null,
    image_url: payload.image_url ?? payload.featured_image ?? null,
    gallery: payload.gallery ?? [],
    status: payload.status ?? "draft",
    featured: payload.featured ?? payload.is_featured ?? false,
    is_featured: payload.is_featured ?? payload.featured ?? false,
    sku: payload.sku ?? null,
  };
}

function normalizeBlogPayload(payload: BlogWritePayload) {
  const slug = payload.slug?.trim() || toSlug(payload.title ?? "");

  return {
    title: payload.title ?? "",
    slug,
    excerpt: payload.excerpt ?? payload.content ?? "",
    content: payload.content ?? payload.excerpt ?? "",
    category: payload.category ?? null,
    cover_image: payload.cover_image ?? payload.cover_image_url ?? payload.image_url ?? null,
    cover_image_url: payload.cover_image_url ?? payload.cover_image ?? payload.image_url ?? null,
    image_url: payload.image_url ?? payload.cover_image_url ?? payload.cover_image ?? null,
    category_id: payload.category_id ?? null,
    tags: payload.tags ?? [],
    author: payload.author ?? "KNLTC",
    published_at: payload.published_at ?? payload.publish_date ?? null,
    publish_date: payload.publish_date ?? payload.published_at ?? null,
    status: payload.status ?? "draft",
  };
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
    status: `eq.published`,
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

export async function createProduct(payload: ProductWritePayload) {
  return (await insertRow("products", normalizeProductPayload(payload), true)) as Product;
}

export async function editProduct(id: string, payload: ProductWritePayload) {
  return (await updateRow("products", id, normalizeProductPayload(payload), true)) as Product;
}

export async function removeProduct(id: string) {
  await deleteRow("products", id, true);
}

export async function createPost(payload: BlogWritePayload) {
  return (await insertRow("blog_posts", normalizeBlogPayload(payload), true)) as BlogPost;
}

export async function editPost(id: string, payload: BlogWritePayload) {
  return (await updateRow("blog_posts", id, normalizeBlogPayload(payload), true)) as BlogPost;
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

export async function createOrder(payload: Omit<Order, "id" | "created_at" | "updated_at" | "order_items">) {
  return (await insertRow("orders", payload, true)) as Order;
}

export async function createOrderItem(payload: Omit<OrderItem, "id">) {
  return (await insertRow("order_items", payload, true)) as OrderItem;
}

export async function getAllAdminOrders(): Promise<AdminOrdersResult> {
  try {
    const orders = (await selectRows("orders", { select: "*,order_items(*)", order: "created_at.desc" }, true)) as Order[];
    return { orders, setupWarning: null };
  } catch (error) {
    logCmsError("admin orders query failed", error);
    return {
      orders: [],
      setupWarning: "Unable to load orders from Supabase right now. Please check your Supabase connection and table setup.",
    };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return (await updateRow("orders", id, { status }, true)) as Order;
}

export async function createProductReview(payload: Omit<ProductReview, "id" | "created_at" | "status">) {
  return (await insertRow("product_reviews", { ...payload, status: "pending" }, true)) as ProductReview;
}

export async function getApprovedReviews(productId: string) {
  return await safeSelectRows<ProductReview>(
    "product_reviews",
    { select: "*", product_id: `eq.${productId}`, status: "eq.approved", order: "created_at.desc" },
    false,
    "approved reviews query failed",
  );
}

export async function getAllAdminReviews() {
  return await safeSelectRows<ProductReview>("product_reviews", { select: "*", order: "created_at.desc" }, true, "admin reviews query failed");
}

export async function getPendingAdminReviews() {
  return await safeSelectRows<ProductReview>(
    "product_reviews",
    { select: "*", status: "eq.pending", order: "created_at.desc" },
    true,
    "pending admin reviews query failed",
  );
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  return (await updateRow("product_reviews", id, { status }, true)) as ProductReview;
}

export async function deleteReview(id: string) {
  await deleteRow("product_reviews", id, true);
}

export async function createCrmLead(
  payload: Omit<CrmLead, "id" | "created_at" | "updated_at" | "status" | "notes"> & { status?: LeadStatus; notes?: string | null },
) {
  return (await insertRow("crm_leads", { ...payload, status: payload.status ?? "new", notes: payload.notes ?? null }, true)) as CrmLead;
}

export async function getAllCrmLeads() {
  return await safeSelectRows<CrmLead>("crm_leads", { select: "*", order: "created_at.desc" }, true, "crm leads query failed");
}

export async function updateCrmLead(id: string, payload: Partial<Pick<CrmLead, "status" | "notes">>) {
  return (await updateRow("crm_leads", id, payload, true)) as CrmLead;
}
