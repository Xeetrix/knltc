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
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
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
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
  }: {
    title: string;
    onClick: () => void;
    activeState?: boolean;
    children: ReactNode;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={title}
          className={`${toolbarButtonClass} ${activeState ? "border-border bg-muted text-foreground" : ""}`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="md:col-span-2 rounded-xl border bg-white shadow-sm">
      <TooltipProvider>
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-xl border-b bg-white/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="flex items-center gap-1 pr-2">
            <IconButton title="Paragraph" onClick={() => exec("formatBlock", "<p>")} activeState={active.formatBlock === "p"}><Pilcrow className="h-4 w-4" /></IconButton>
            <IconButton title="Heading 1" onClick={() => exec("formatBlock", "<h1>")} activeState={active.formatBlock === "h1"}><Heading1 className="h-4 w-4" /></IconButton>
            <IconButton title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} activeState={active.formatBlock === "h2"}><Heading2 className="h-4 w-4" /></IconButton>
            <IconButton title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} activeState={active.formatBlock === "h3"}><Heading3 className="h-4 w-4" /></IconButton>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1 px-2">
            <IconButton title="Bold" onClick={() => exec("bold")} activeState={active.bold}><Bold className="h-4 w-4" /></IconButton>
            <IconButton title="Italic" onClick={() => exec("italic")} activeState={active.italic}><Italic className="h-4 w-4" /></IconButton>
            <IconButton title="Underline" onClick={() => exec("underline")} activeState={active.underline}><Underline className="h-4 w-4" /></IconButton>
            <select className="h-8 rounded-md border bg-white px-2 text-xs" onChange={(e) => exec("fontSize", e.target.value)} defaultValue="3" aria-label="Font size">
              <option value="2">Small</option><option value="3">Normal</option><option value="5">Large</option><option value="7">XL</option>
            </select>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1 px-2">
            <IconButton title="Align left" onClick={() => exec("justifyLeft")} activeState={active.align === "left"}><AlignLeft className="h-4 w-4" /></IconButton>
            <IconButton title="Align center" onClick={() => exec("justifyCenter")} activeState={active.align === "center"}><AlignCenter className="h-4 w-4" /></IconButton>
            <IconButton title="Align right" onClick={() => exec("justifyRight")} activeState={active.align === "right"}><AlignRight className="h-4 w-4" /></IconButton>
            <IconButton title="Justify" onClick={() => exec("justifyFull")} activeState={active.align === "justify"}><AlignJustify className="h-4 w-4" /></IconButton>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1 px-2">
            <IconButton title="Bulleted list" onClick={() => exec("insertUnorderedList")} activeState={active.unorderedList}><List className="h-4 w-4" /></IconButton>
            <IconButton title="Numbered list" onClick={() => exec("insertOrderedList")} activeState={active.orderedList}><ListOrdered className="h-4 w-4" /></IconButton>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1 px-2">
            <IconButton title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="h-4 w-4" /></IconButton>
            <IconButton title="Insert link" onClick={() => { const url = window.prompt("URL"); if (url) exec("createLink", url); }}><Link className="h-4 w-4" /></IconButton>
            <IconButton title="Horizontal line" onClick={() => exec("insertHorizontalRule")}><SeparatorHorizontal className="h-4 w-4" /></IconButton>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className={toolbarButtonClass} aria-label="Insert image">
                  <Image className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAndInsertImage(e.target.files[0])} />
                </label>
              </TooltipTrigger>
              <TooltipContent side="bottom">Insert image</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1 px-2">
            <label className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground">
              Text
              <input type="color" onChange={(e) => exec("foreColor", e.target.value)} aria-label="Text color" className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />
            </label>
            <label className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground">
              Highlight
              <input type="color" onChange={(e) => exec("hiliteColor", e.target.value)} aria-label="Highlight color" className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-1 pl-2">
            <IconButton title="Undo" onClick={() => exec("undo")}><Undo2 className="h-4 w-4" /></IconButton>
            <IconButton title="Redo" onClick={() => exec("redo")}><Redo2 className="h-4 w-4" /></IconButton>
            <IconButton title="Clear formatting" onClick={() => exec("removeFormat")}><RemoveFormatting className="h-4 w-4" /></IconButton>
          </div>

          {uploading ? <span className="ml-2 text-xs text-muted-foreground">Uploading...</span> : null}
        </div>
      </TooltipProvider>
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
