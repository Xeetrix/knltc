import AdminShell from "@/components/admin/AdminShell";
import BlogManager from "@/components/admin/BlogManager";
import { getAllAdminPosts, getCategories } from "@/lib/cms";

export default async function AdminBlogPage() {
  const [posts, categories] = await Promise.all([getAllAdminPosts(), getCategories("blog")]);

  return (
    <AdminShell title="Manage Blog Posts">
      <BlogManager initialPosts={posts} categories={categories} />
    </AdminShell>
  );
}
