"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  UnderlineIcon,
  Undo2,
} from "lucide-react";
import { notify } from "@/lib/notify";

type Props = { value: string; onChange: (value: string) => void };
type UploadImageResponse = { url?: string; error?: string };

const allowedTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export default function RichTextEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: "blog-content-image" } }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your blog post content here..." }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rich-editor min-h-[420px] px-6 py-5 text-[15px] leading-7 text-slate-800 outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  const validateImage = (file: File) => {
    if (!allowedTypes.has(file.type)) {
      notify("error", "Upload failed", "Only JPG, JPEG, PNG, and WEBP images are supported.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Upload failed", "Image must be 5MB or smaller.");
      return false;
    }
    return true;
  };

  const uploadImage = async (file: File) => {
    if (!validateImage(file)) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/blog-images/upload", { method: "POST", body: formData });
      const data = (await response.json()) as UploadImageResponse;
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Image upload failed.");
      }
      editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      notify("success", "Image inserted", "Image uploaded successfully.");
    } catch (error) {
      notify("error", "Upload failed", error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const applyLink = () => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setLinkUrl("");
  };

  const groups = useMemo(
    () => [
      [
        { icon: Pilcrow, label: "Paragraph", action: () => editor?.chain().focus().setParagraph().run(), active: editor?.isActive("paragraph") },
        { icon: Heading1, label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive("heading", { level: 1 }) },
        { icon: Heading2, label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
        { icon: Heading3, label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
      ],
      [
        { icon: Bold, label: "Bold", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
        { icon: Italic, label: "Italic", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
        { icon: UnderlineIcon, label: "Underline", action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive("underline") },
        { icon: Quote, label: "Blockquote", action: () => editor?.chain().focus().toggleBlockquote().run(), active: editor?.isActive("blockquote") },
        { icon: Minus, label: "Horizontal rule", action: () => editor?.chain().focus().setHorizontalRule().run(), active: false },
      ],
      [
        { icon: List, label: "Bullet list", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
        { icon: ListOrdered, label: "Numbered list", action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") },
      ],
      [
        { icon: AlignLeft, label: "Align left", action: () => editor?.chain().focus().setTextAlign("left").run(), active: editor?.isActive({ textAlign: "left" }) },
        { icon: AlignCenter, label: "Align center", action: () => editor?.chain().focus().setTextAlign("center").run(), active: editor?.isActive({ textAlign: "center" }) },
        { icon: AlignRight, label: "Align right", action: () => editor?.chain().focus().setTextAlign("right").run(), active: editor?.isActive({ textAlign: "right" }) },
        { icon: AlignJustify, label: "Justify", action: () => editor?.chain().focus().setTextAlign("justify").run(), active: editor?.isActive({ textAlign: "justify" }) },
      ],
    ],
    [editor],
  );

  if (!editor) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading editor...</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-3 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
          {groups.map((group, index) => (
            <div key={index} className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-1.5 py-1 shadow-sm">
              {group.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  onClick={item.action}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${item.active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          ))}
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-1.5 py-1 shadow-sm">
            <button type="button" onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()} title="Remove link" aria-label="Remove link" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
              <LinkIcon className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadImage(file);
              }}
            />
            <button type="button" onClick={() => fileInputRef.current?.click()} title="Insert image" aria-label="Insert image" className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-slate-600 hover:bg-slate-100">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              <span className="text-xs font-medium">Insert Image</span>
            </button>
            <button type="button" onClick={() => editor.chain().focus().undo().run()} title="Undo" aria-label="Undo" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
              <Undo2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} title="Redo" aria-label="Redo" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2">
        <input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://example.com" className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm" />
        <button type="button" onClick={applyLink} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium">Apply Link</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
