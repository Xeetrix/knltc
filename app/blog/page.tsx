import Link from "next/link";
import { getPublishedPosts } from "@/lib/cms";

export const metadata = {
  title: "Blog",
  description: "KNLTC blog for Japan study and career guidance.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-2 text-muted-foreground">Study guides, visa tips, Japanese language, and career updates.</p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block rounded-xl border bg-card p-5 transition hover:border-primary/40">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{post.categories?.name ?? "Uncategorized"}</p>
              <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted-foreground">By {post.author}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
