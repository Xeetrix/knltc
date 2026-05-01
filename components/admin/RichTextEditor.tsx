"use client";

import { useRef, useState } from "react";

type Props = { value: string; onChange: (value: string) => void };

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  const exec = (command: string, val?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, val);
    onChange(ref.current?.innerHTML ?? "");
  };

  const uploadAndInsertImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "blog-images");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return;
    exec("insertImage", data.url);
  };

  return (
    <div className="md:col-span-2 rounded-xl border bg-card">
      <div className="flex flex-wrap gap-2 border-b p-2 text-sm">
        <button type="button" onClick={() => exec("formatBlock", "<h1>")}>H1</button>
        <button type="button" onClick={() => exec("formatBlock", "<h2>")}>H2</button>
        <button type="button" onClick={() => exec("formatBlock", "<h3>")}>H3</button>
        <button type="button" onClick={() => exec("formatBlock", "<p>")}>P</button>
        <button type="button" onClick={() => exec("bold")}>B</button>
        <button type="button" onClick={() => exec("italic")}>I</button>
        <button type="button" onClick={() => exec("underline")}>U</button>
        <select onChange={(e) => exec("fontSize", e.target.value)} defaultValue="3"><option value="2">S</option><option value="3">M</option><option value="5">L</option><option value="7">XL</option></select>
        <input type="color" onChange={(e) => exec("foreColor", e.target.value)} />
        <input type="color" onChange={(e) => exec("hiliteColor", e.target.value)} />
        <button type="button" onClick={() => exec("justifyLeft")}>Left</button>
        <button type="button" onClick={() => exec("justifyCenter")}>Center</button>
        <button type="button" onClick={() => exec("justifyRight")}>Right</button>
        <button type="button" onClick={() => exec("justifyFull")}>Justify</button>
        <button type="button" onClick={() => exec("insertUnorderedList")}>• List</button>
        <button type="button" onClick={() => exec("insertOrderedList")}>1. List</button>
        <button type="button" onClick={() => exec("formatBlock", "<blockquote>")}>Quote</button>
        <button type="button" onClick={() => { const url = window.prompt("URL"); if (url) exec("createLink", url); }}>Link</button>
        <button type="button" onClick={() => exec("insertHorizontalRule")}>HR</button>
        <label className="cursor-pointer">Image<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAndInsertImage(e.target.files[0])} /></label>
        <button type="button" onClick={() => {
          const img = window.getSelection()?.anchorNode?.parentElement;
          if (img?.tagName === "IMG") {
            const width = window.prompt("Image width in px", "600");
            if (width) {
              (img as HTMLImageElement).style.width = `${Number(width)}px`;
              onChange(ref.current?.innerHTML ?? "");
            }
          }
        }}>Resize Img</button>
        <button type="button" onClick={() => exec("undo")}>Undo</button>
        <button type="button" onClick={() => exec("redo")}>Redo</button>
        {uploading ? <span className="text-xs text-muted-foreground">Uploading...</span> : null}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="min-h-56 p-3 outline-none"
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
