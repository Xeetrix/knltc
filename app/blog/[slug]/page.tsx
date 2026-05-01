import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/cms";
import RichContent from "@/components/blog/RichContent";

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <article className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{post.categories?.name ?? "Uncategorized"}</p>
          <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">By {post.author}</p>
          <RichContent html={post.content} />
        </article>
      </div>
    </section>
  );
}
