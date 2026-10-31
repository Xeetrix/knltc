"use client";

import React, { useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { uploadDocumentFile, uploadMediaImage } from "@/lib/media-upload";

interface DriveFileUploadButtonProps {
  onUploaded: (url: string, fileName?: string) => void;
  folderName?: string;
  accept?: string;
  label?: string;
  className?: string;
}

export default function DriveFileUploadButton({
  onUploaded,
  folderName = "KNLTC_Dashboard_Uploads",
  accept = "image/*,application/pdf",
  label = "Upload File",
  className = "",
}: DriveFileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedOk, setUploadedOk] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedOk(false);
    try {
      const result = file.type.startsWith("image/")
        ? await uploadMediaImage(file, { folderName })
        : await uploadDocumentFile(file, { folderName });

      if (result.url) {
        onUploaded(result.url, result.fileName || file.name);
        setUploadedOk(true);
        setTimeout(() => setUploadedOk(false), 3000);
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className={
          className ||
          "inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-60"
        }
      >
        {isUploading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" />
            <span>Uploading...</span>
          </>
        ) : uploadedOk ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Uploaded!</span>
          </>
        ) : (
          <>
            <Upload className="h-3.5 w-3.5 text-emerald-700" />
            <span>{label}</span>
          </>
        )}
      </button>
    </>
  );
}
