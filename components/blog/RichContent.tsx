import { sanitizeRichHtml } from "@/lib/sanitize-rich-html";

export default function RichContent({ html }: { html: string }) {
  const safe = sanitizeRichHtml(html);
  return <div className="prose prose-neutral mt-6 max-w-none prose-headings:font-semibold prose-p:leading-8 prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:bg-slate-50/70 prose-blockquote:py-1 prose-blockquote:italic prose-li:my-1 prose-img:my-8" dangerouslySetInnerHTML={{ __html: safe }} />;
}
