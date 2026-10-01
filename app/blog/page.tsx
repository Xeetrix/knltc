import { getPublishedPosts } from "@/lib/cms";
import BlogListClient from "@/components/blog/BlogListClient";

export const metadata = {
  title: "Blog",
  description: "KNLTC blog for Japan study, language courses, and career guidance.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogListClient posts={posts} />;
}
