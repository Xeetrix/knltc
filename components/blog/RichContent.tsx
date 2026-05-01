import { sanitizeRichHtml } from "@/lib/sanitize-rich-html";

export default function RichContent({ html }: { html: string }) {
  const safe = sanitizeRichHtml(html);
  return <div className="prose prose-neutral mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: safe }} />;
}
