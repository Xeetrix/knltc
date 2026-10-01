import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/cms";
import BlogDetailClient from "@/components/blog/BlogDetailClient";

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  return <BlogDetailClient post={post} />;
}
