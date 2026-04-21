"use client";

import { useState, type ChangeEvent } from "react";

export default function UploadManager() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }

    setUrl(data.url);
  };

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-3 text-sm text-muted-foreground">Upload image to Supabase Storage.</p>
      <input type="file" accept="image/*" onChange={upload} />
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {url ? (
        <div className="mt-4">
          <p className="text-sm font-medium">Uploaded URL</p>
          <input className="mt-2 w-full rounded-md border px-3 py-2 text-sm" readOnly value={url} />
        </div>
      ) : null}
    </div>
  );
}
