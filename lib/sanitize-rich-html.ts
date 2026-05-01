const blockedTags = ["script", "iframe", "object", "embed", "style", "link", "meta"];

export function sanitizeRichHtml(html: string) {
  if (!html) return "";
  let output = html;
  blockedTags.forEach((tag) => {
    const pair = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    output = output.replace(pair, "");
    const single = new RegExp(`<${tag}[^>]*\\/?\\s*>`, "gi");
    output = output.replace(single, "");
  });

  output = output.replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  output = output.replace(/\s(href|src)=("|')\s*javascript:[^"']*("|')/gi, "");
  return output;
}
