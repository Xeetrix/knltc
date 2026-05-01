"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Loader2,
  Pilcrow,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Underline,
  Undo2,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const toolbarButtonClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

const groupClass = "flex shrink-0 items-center gap-1 rounded-md bg-white px-1";

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [active, setActive] = useState<ActiveStates>({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
    align: null,
    formatBlock: "p",
  });

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
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateToolbarState);
    return () => document.removeEventListener("selectionchange", updateToolbarState);
  }, []);

  const exec = (command: string, val?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, val);
    updateToolbarState();
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

  const IconButton = ({
    title,
    onClick,
    activeState,
    children,
    disabled,
  }: {
    title: string;
    onClick: () => void;
    activeState?: boolean;
    children: ReactNode;
    disabled?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          title={title}
          aria-label={title}
          className={`${toolbarButtonClass} ${activeState ? "border-border bg-muted text-foreground shadow-sm" : ""}`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
      <TooltipProvider>
        <div className="sticky top-0 z-10 rounded-t-xl border-b border-slate-200 bg-white/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            <div className={groupClass}>
              <select
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Paragraph style"
                title="Paragraph style"
                value={active.formatBlock}
                onChange={(e) => exec("formatBlock", `<${e.target.value}>`)}
              >
                <option value="p">Paragraph</option>
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </select>
              <IconButton title="Heading 1" onClick={() => exec("formatBlock", "<h1>")} activeState={active.formatBlock === "h1"}><Heading1 className="h-4 w-4" /></IconButton>
              <IconButton title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} activeState={active.formatBlock === "h2"}><Heading2 className="h-4 w-4" /></IconButton>
              <IconButton title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} activeState={active.formatBlock === "h3"}><Heading3 className="h-4 w-4" /></IconButton>
              <IconButton title="Paragraph" onClick={() => exec("formatBlock", "<p>")} activeState={active.formatBlock === "p"}><Pilcrow className="h-4 w-4" /></IconButton>
            </div>

            <div className="my-1 h-6 w-px shrink-0 bg-slate-200" />

            <div className={groupClass}>
              <IconButton title="Bold" onClick={() => exec("bold")} activeState={active.bold}><Bold className="h-4 w-4" /></IconButton>
              <IconButton title="Italic" onClick={() => exec("italic")} activeState={active.italic}><Italic className="h-4 w-4" /></IconButton>
              <IconButton title="Underline" onClick={() => exec("underline")} activeState={active.underline}><Underline className="h-4 w-4" /></IconButton>
            </div>

            <div className="my-1 h-6 w-px shrink-0 bg-slate-200" />

            <div className={groupClass}>
              <label className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs text-slate-600" title="Text color">
                A
                <input type="color" onChange={(e) => exec("foreColor", e.target.value)} aria-label="Text color" className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />
              </label>
              <label className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs text-slate-600" title="Highlight color">
                H
                <input type="color" onChange={(e) => exec("hiliteColor", e.target.value)} aria-label="Highlight color" className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />
              </label>
            </div>

            <div className="my-1 h-6 w-px shrink-0 bg-slate-200" />

            <div className={groupClass}>
              <IconButton title="Align left" onClick={() => exec("justifyLeft")} activeState={active.align === "left"}><AlignLeft className="h-4 w-4" /></IconButton>
              <IconButton title="Align center" onClick={() => exec("justifyCenter")} activeState={active.align === "center"}><AlignCenter className="h-4 w-4" /></IconButton>
              <IconButton title="Align right" onClick={() => exec("justifyRight")} activeState={active.align === "right"}><AlignRight className="h-4 w-4" /></IconButton>
              <IconButton title="Justify" onClick={() => exec("justifyFull")} activeState={active.align === "justify"}><AlignJustify className="h-4 w-4" /></IconButton>
            </div>

            <div className="my-1 h-6 w-px shrink-0 bg-slate-200" />

            <div className={groupClass}>
              <IconButton title="Bulleted list" onClick={() => exec("insertUnorderedList")} activeState={active.unorderedList}><List className="h-4 w-4" /></IconButton>
              <IconButton title="Numbered list" onClick={() => exec("insertOrderedList")} activeState={active.orderedList}><ListOrdered className="h-4 w-4" /></IconButton>
            </div>

            <div className="my-1 h-6 w-px shrink-0 bg-slate-200" />

            <div className={groupClass}>
              <IconButton title="Insert link" onClick={() => { const url = window.prompt("URL"); if (url) exec("createLink", url); }}><Link className="h-4 w-4" /></IconButton>
              <label
                className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-md border border-transparent px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Insert image"
                title="Insert image"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
                <span className="font-medium">Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAndInsertImage(e.target.files[0])} disabled={uploading} />
              </label>
              <IconButton title="Horizontal line" onClick={() => exec("insertHorizontalRule")}><SeparatorHorizontal className="h-4 w-4" /></IconButton>
              <IconButton title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="h-4 w-4" /></IconButton>
            </div>

            <div className="my-1 h-6 w-px shrink-0 bg-slate-200" />

            <div className={`${groupClass} ml-auto`}>
              <IconButton title="Undo" onClick={() => exec("undo")}><Undo2 className="h-4 w-4" /></IconButton>
              <IconButton title="Redo" onClick={() => exec("redo")}><Redo2 className="h-4 w-4" /></IconButton>
            </div>
          </div>
          {uploading ? <p className="mt-1 text-xs text-muted-foreground">Uploading image...</p> : null}
        </div>
      </TooltipProvider>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[350px] rounded-b-xl border-t border-slate-100 px-5 py-4 text-[15px] leading-7 text-slate-800 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)]"
        data-placeholder="Start writing your blog post..."
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
