import { sanitizeRichHtml } from "@/lib/sanitize-rich-html";

export default function RichContent({ html }: { html: string }) {
  const safe = sanitizeRichHtml(html);
  return <div className="prose prose-neutral mt-6 max-w-none prose-headings:font-semibold prose-p:leading-8 prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:bg-slate-50/70 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:italic prose-li:my-1 prose-a:text-blue-700 prose-a:underline prose-a:underline-offset-2 prose-img:my-8 prose-img:max-w-full prose-img:rounded-xl prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: safe }} />;
}
