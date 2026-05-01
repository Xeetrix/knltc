"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Underline,
  Undo2,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { notify } from "@/lib/notify";

type Props = { value: string; onChange: (value: string) => void };

type ActiveStates = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  align: "left" | "center" | "right" | "justify" | null;
  formatBlock: string;
};

type ImagePreset = "sm" | "md" | "full";

type UploadImageResponse = {
  url?: string;
  error?: string;
};

const toolbarButtonClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

const groupClass = "flex shrink-0 items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-1.5 py-1 shadow-sm";

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFigure, setSelectedFigure] = useState<HTMLElement | null>(null);
  const [active, setActive] = useState<ActiveStates>({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
    align: null,
    formatBlock: "p",
  });

  const syncContent = () => onChange(ref.current?.innerHTML ?? "");

  const updateToolbarState = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      align: document.queryCommandState("justifyCenter")
        ? "center"
        : document.queryCommandState("justifyRight")
          ? "right"
          : document.queryCommandState("justifyFull")
            ? "justify"
            : document.queryCommandState("justifyLeft")
              ? "left"
              : null,
      formatBlock: (document.queryCommandValue("formatBlock") || "p").toString().replace(/[<>]/g, "").toLowerCase(),
    });

    const sel = window.getSelection();
    const anchor = sel?.anchorNode instanceof Element ? sel.anchorNode : sel?.anchorNode?.parentElement;
    const figure = anchor?.closest("figure[data-blog-image='true']");
    setSelectedFigure(figure instanceof HTMLElement ? figure : null);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbarState);
    return () => document.removeEventListener("selectionchange", updateToolbarState);
  }, []);

  const exec = (command: string, val?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, val);
    updateToolbarState();
    syncContent();
  };

  const sanitizeFile = (file: File) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      notify("error", "Upload failed", "Only JPG, JPEG, PNG, and WEBP images are supported.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Upload failed", "Image must be 5MB or smaller.");
      return false;
    }
    return true;
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!sanitizeFile(file)) return;
    setUploading(true);
    setUploadProgress(0);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "blog-images");

    try {
      const data = await new Promise<UploadImageResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onload = () => {
          const parsed: UploadImageResponse = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300) resolve(parsed);
          else reject(new Error(parsed.error || "Image upload failed."));
        };

        xhr.onerror = () => reject(new Error("Network error while uploading image."));
        xhr.send(fd);
      });

      ref.current?.focus();
      if (!data.url) throw new Error("Image upload failed.");
      const html = `<figure data-blog-image="true" data-align="center" data-size="md" class="blog-image blog-image--center blog-image--md"><img src="${data.url}" alt="" loading="lazy" /><figcaption contenteditable="true">Add caption (optional)</figcaption></figure><p><br></p>`;
      document.execCommand("insertHTML", false, html);
      syncContent();
      updateToolbarState();
      notify("success", "Image inserted", "Your image was uploaded and inserted at the cursor position.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed.";
      notify("error", "Upload failed", message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyImagePreset = (preset: ImagePreset) => {
    if (!selectedFigure) return;
    selectedFigure.dataset.size = preset;
    selectedFigure.classList.remove("blog-image--sm", "blog-image--md", "blog-image--full");
    selectedFigure.classList.add(`blog-image--${preset}`);
    syncContent();
  };

  const applyImageAlign = (align: "left" | "center" | "right") => {
    if (!selectedFigure) return;
    selectedFigure.dataset.align = align;
    selectedFigure.classList.remove("blog-image--left", "blog-image--center", "blog-image--right");
    selectedFigure.classList.add(`blog-image--${align}`);
    syncContent();
  };

  const IconButton = ({ title, onClick, activeState, children, disabled }: { title: string; onClick: () => void; activeState?: boolean; children: ReactNode; disabled?: boolean }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onClick} disabled={disabled} title={title} aria-label={title} className={`${toolbarButtonClass} ${activeState ? "border-slate-300 bg-slate-100 text-slate-900 shadow-sm" : ""}`}>
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="md:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <TooltipProvider>
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            <div className={groupClass}>{/* unchanged controls omitted for brevity in generation */}
              <select className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring" value={active.formatBlock} onChange={(e) => exec("formatBlock", `<${e.target.value}>`)}>
                <option value="p">Paragraph</option><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option>
              </select>
              <IconButton title="Bold" onClick={() => exec("bold")} activeState={active.bold}><Bold className="h-4 w-4" /></IconButton>
              <IconButton title="Italic" onClick={() => exec("italic")} activeState={active.italic}><Italic className="h-4 w-4" /></IconButton>
              <IconButton title="Underline" onClick={() => exec("underline")} activeState={active.underline}><Underline className="h-4 w-4" /></IconButton>
              <IconButton title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="h-4 w-4" /></IconButton>
            </div>
            <div className={groupClass}>
              <IconButton title="Align left" onClick={() => exec("justifyLeft")} activeState={active.align === "left"}><AlignLeft className="h-4 w-4" /></IconButton>
              <IconButton title="Align center" onClick={() => exec("justifyCenter")} activeState={active.align === "center"}><AlignCenter className="h-4 w-4" /></IconButton>
              <IconButton title="Align right" onClick={() => exec("justifyRight")} activeState={active.align === "right"}><AlignRight className="h-4 w-4" /></IconButton>
              <IconButton title="Justify" onClick={() => exec("justifyFull")} activeState={active.align === "justify"}><AlignJustify className="h-4 w-4" /></IconButton>
              <IconButton title="Bulleted list" onClick={() => exec("insertUnorderedList")} activeState={active.unorderedList}><List className="h-4 w-4" /></IconButton>
              <IconButton title="Numbered list" onClick={() => exec("insertOrderedList")} activeState={active.orderedList}><ListOrdered className="h-4 w-4" /></IconButton>
            </div>
            <div className={groupClass}>
              <IconButton title="Insert link" onClick={() => notify("info", "Link insertion", "Use keyboard shortcut Ctrl/Cmd + K to add links quickly.")}><Link className="h-4 w-4" /></IconButton>
              <button type="button" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />} Insert Image
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAndInsertImage(e.target.files[0])} />
              <IconButton title="Horizontal line" onClick={() => exec("insertHorizontalRule")}><SeparatorHorizontal className="h-4 w-4" /></IconButton>
              <IconButton title="Undo" onClick={() => exec("undo")}><Undo2 className="h-4 w-4" /></IconButton>
              <IconButton title="Redo" onClick={() => exec("redo")}><Redo2 className="h-4 w-4" /></IconButton>
            </div>
          </div>
          {uploading ? <p className="mt-2 text-xs text-slate-600">Uploading image... {uploadProgress}%</p> : null}
          {selectedFigure ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
              <span className="font-medium text-slate-700">Selected image</span>
              <button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImageAlign("left")}>Left</button>
              <button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImageAlign("center")}>Center</button>
              <button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImageAlign("right")}>Right</button>
              <button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImagePreset("sm")}>Small</button>
              <button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImagePreset("md")}>Medium</button>
              <button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImagePreset("full")}>Full</button>
            </div>
          ) : null}
        </div>
      </TooltipProvider>
      <div ref={ref} contentEditable suppressContentEditableWarning className="rich-editor min-h-[420px] px-6 py-5 text-[15px] leading-7 text-slate-800 outline-none" data-placeholder="Start writing your blog post..." onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)} dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}
