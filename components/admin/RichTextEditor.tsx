"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Image, Italic, Link, List, ListOrdered, Loader2, Quote, Redo2, RefreshCw, Search, SeparatorHorizontal, Trash2, Underline, Undo2, Upload } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { notify } from "@/lib/notify";

type Props = { value: string; onChange: (value: string) => void };
type ImagePreset = "sm" | "md" | "full";
type ImageAlign = "left" | "center" | "right";
type UploadImageResponse = { url?: string; error?: string };
type MediaListItem = { name: string; url: string; created_at?: string | null };

const toolbarButtonClass = "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
const groupClass = "flex shrink-0 items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-1.5 py-1 shadow-sm";

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const [selectedFigure, setSelectedFigure] = useState<HTMLElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [library, setLibrary] = useState<MediaListItem[]>([]);

  const syncContent = () => onChange(ref.current?.innerHTML ?? "");
  const updateToolbarState = () => {
    const sel = window.getSelection();
    const anchor = sel?.anchorNode instanceof Element ? sel.anchorNode : sel?.anchorNode?.parentElement;
    const figure = anchor?.closest("figure[data-blog-image='true']");
    ref.current?.querySelectorAll("figure[data-blog-image='true']").forEach((node) => node.classList.remove("is-selected"));
    if (figure instanceof HTMLElement) {
      figure.classList.add("is-selected");
      setSelectedFigure(figure);
      return;
    }
    setSelectedFigure(null);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbarState);
    return () => document.removeEventListener("selectionchange", updateToolbarState);
  }, []);

  const exec = (command: string, val?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, val);
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

  const insertImageBlock = (url: string, replace = false) => {
    if (replace && selectedFigure) {
      const img = selectedFigure.querySelector("img");
      if (img) img.setAttribute("src", url);
      syncContent();
      return;
    }
    ref.current?.focus();
    const html = `<figure data-blog-image="true" data-align="center" data-size="md" class="blog-image blog-image--center blog-image--md"><img src="${url}" alt="" loading="lazy" /><figcaption contenteditable="true">Add caption (optional)</figcaption></figure><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    syncContent();
  };

  const fetchMediaLibrary = async () => {
    setLibraryLoading(true);
    try {
      const res = await fetch("/api/admin/blog-images/list", { cache: "no-store" });
      const data = (await res.json()) as { items?: MediaListItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load media library.");
      setLibrary(data.items ?? []);
    } catch (error) {
      notify("error", "Media library", error instanceof Error ? error.message : "Failed to load media library.");
    } finally {
      setLibraryLoading(false);
    }
  };

  const uploadImage = async (file: File, replace = false) => {
    if (!sanitizeFile(file)) return;
    setUploading(true);
    setUploadProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const data = await new Promise<UploadImageResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/blog-images/upload");
        xhr.upload.onprogress = (event) => event.lengthComputable && setUploadProgress(Math.round((event.loaded / event.total) * 100));
        xhr.onload = () => {
          const parsed = JSON.parse(xhr.responseText || "{}") as UploadImageResponse;
          if (xhr.status >= 200 && xhr.status < 300) resolve(parsed);
          else reject(new Error(parsed.error || "Image upload failed."));
        };
        xhr.onerror = () => reject(new Error("Network error while uploading image."));
        xhr.send(fd);
      });
      if (!data.url) throw new Error("Image upload failed.");
      insertImageBlock(data.url, replace);
      notify("success", replace ? "Image replaced" : "Image inserted", "Image uploaded successfully.");
      setShowModal(false);
      void fetchMediaLibrary();
    } catch (error) {
      notify("error", "Upload failed", error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileRef.current) fileRef.current.value = "";
      if (replaceFileRef.current) replaceFileRef.current.value = "";
    }
  };

  const filtered = useMemo(() => library.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [library, search]);
  const applyImagePreset = (preset: ImagePreset) => { if (!selectedFigure) return; selectedFigure.dataset.size = preset; selectedFigure.classList.remove("blog-image--sm", "blog-image--md", "blog-image--full"); selectedFigure.classList.add(`blog-image--${preset}`); syncContent(); };
  const applyImageAlign = (align: ImageAlign) => { if (!selectedFigure) return; selectedFigure.dataset.align = align; selectedFigure.classList.remove("blog-image--left", "blog-image--center", "blog-image--right"); selectedFigure.classList.add(`blog-image--${align}`); syncContent(); };

  const IconButton = ({ title, onClick, children }: { title: string; onClick: () => void; children: ReactNode }) => <Tooltip><TooltipTrigger asChild><button type="button" onClick={onClick} title={title} aria-label={title} className={toolbarButtonClass}>{children}</button></TooltipTrigger><TooltipContent side="bottom">{title}</TooltipContent></Tooltip>;

  return <div className="md:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><TooltipProvider><div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-3 py-3"><div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap"><div className={groupClass}><IconButton title="Bold" onClick={() => exec("bold")}><Bold className="h-4 w-4" /></IconButton><IconButton title="Italic" onClick={() => exec("italic")}><Italic className="h-4 w-4" /></IconButton><IconButton title="Underline" onClick={() => exec("underline")}><Underline className="h-4 w-4" /></IconButton><IconButton title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="h-4 w-4" /></IconButton></div><div className={groupClass}><IconButton title="Align left" onClick={() => exec("justifyLeft")}><AlignLeft className="h-4 w-4" /></IconButton><IconButton title="Align center" onClick={() => exec("justifyCenter")}><AlignCenter className="h-4 w-4" /></IconButton><IconButton title="Align right" onClick={() => exec("justifyRight")}><AlignRight className="h-4 w-4" /></IconButton><IconButton title="Justify" onClick={() => exec("justifyFull")}><AlignJustify className="h-4 w-4" /></IconButton><IconButton title="Bulleted list" onClick={() => exec("insertUnorderedList")}><List className="h-4 w-4" /></IconButton><IconButton title="Numbered list" onClick={() => exec("insertOrderedList")}><ListOrdered className="h-4 w-4" /></IconButton></div><div className={groupClass}><IconButton title="Insert link" onClick={() => notify("info", "Link insertion", "Use keyboard shortcut Ctrl/Cmd + K to add links quickly.")}><Link className="h-4 w-4" /></IconButton><button type="button" className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-medium" onClick={() => { setShowModal(true); void fetchMediaLibrary(); }}><Image className="h-4 w-4" /> Insert Image</button><IconButton title="Horizontal line" onClick={() => exec("insertHorizontalRule")}><SeparatorHorizontal className="h-4 w-4" /></IconButton><IconButton title="Undo" onClick={() => exec("undo")}><Undo2 className="h-4 w-4" /></IconButton><IconButton title="Redo" onClick={() => exec("redo")}><Redo2 className="h-4 w-4" /></IconButton></div></div>{uploading ? <p className="mt-2 text-xs text-slate-600">Uploading image... {uploadProgress}%</p> : null}{selectedFigure ? <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs"><span className="font-medium">Selected image</span><button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImagePreset("sm")}>Small</button><button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImagePreset("md")}>Medium</button><button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImagePreset("full")}>Full width</button><button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImageAlign("left")}>Align left</button><button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImageAlign("center")}>Align center</button><button type="button" className="rounded border px-2 py-0.5" onClick={() => applyImageAlign("right")}>Align right</button><button type="button" className="inline-flex items-center rounded border px-2 py-0.5" onClick={() => replaceFileRef.current?.click()}><Upload className="mr-1 h-3 w-3" />Replace</button><button type="button" className="inline-flex items-center rounded border px-2 py-0.5 text-red-600" onClick={() => { selectedFigure.remove(); setSelectedFigure(null); syncContent(); }}><Trash2 className="mr-1 h-3 w-3" />Remove</button><input ref={replaceFileRef} type="file" className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], true)} /></div> : null}</div></TooltipProvider><div ref={ref} contentEditable suppressContentEditableWarning className="rich-editor min-h-[420px] px-6 py-5 text-[15px] leading-7 text-slate-800 outline-none" onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)} dangerouslySetInnerHTML={{ __html: value }} />

{showModal ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-3xl rounded-xl bg-white p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-semibold">Insert Image</h3><button type="button" className="rounded border px-2 py-1 text-sm" onClick={() => setShowModal(false)}>Close</button></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-lg border p-3"><p className="mb-2 text-sm font-medium">Upload New</p><div className="rounded-md border border-dashed p-4 text-center"><input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} /><button type="button" className="rounded border px-3 py-1 text-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>Choose file</button><p className="mt-2 text-xs text-slate-500">JPG, JPEG, PNG, WEBP up to 5MB</p></div></div><div className="rounded-lg border p-3"><div className="mb-2 flex items-center justify-between"><p className="text-sm font-medium">Media Library</p><button type="button" className="inline-flex items-center rounded border px-2 py-1 text-xs" onClick={() => void fetchMediaLibrary()}><RefreshCw className="mr-1 h-3 w-3" />Refresh</button></div><div className="mb-2 flex items-center rounded border px-2"><Search className="h-3 w-3" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full border-0 p-1 text-xs outline-none" /></div><div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">{libraryLoading ? <p className="col-span-3 text-xs">Loading...</p> : filtered.length === 0 ? <p className="col-span-3 text-xs text-slate-500">No images yet.</p> : filtered.map((item) => <button key={item.name} type="button" className="overflow-hidden rounded border" onClick={() => { insertImageBlock(item.url); setShowModal(false); }}><img src={item.url} alt={item.name} className="h-20 w-full object-cover" /></button>)}</div></div></div></div></div> : null}
</div>;
}
