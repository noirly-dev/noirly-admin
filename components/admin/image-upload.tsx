"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = "portfolio",
  className,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const presign = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          folder,
        }),
      });

      if (!presign.ok) {
        throw new Error("Failed to prepare upload");
      }

      const { uploadUrl, publicUrl } = await presign.json();
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!put.ok) {
        throw new Error("Upload failed");
      }

      onChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex items-start gap-4">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--hairline)] bg-[var(--surface-2)]">
          {value ? (
            <>
              <Image src={value} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white"
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <Upload size={18} className="text-[var(--muted-foreground)]" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            className="text-xs text-[var(--muted-foreground)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[var(--accent)]"
          />
          <input
            type="url"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="Or paste a URL"
            className="h-9 w-full rounded-lg border border-[var(--hairline)] bg-[var(--surface)] px-3 text-xs"
          />
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
          {uploading ? (
            <p className="text-xs text-[var(--muted-foreground)]">Uploading to R2…</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SaveBar({
  saving,
  onSave,
  label = "Save changes",
}: {
  saving: boolean;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 border-t border-[var(--hairline)] bg-[var(--bg)]/90 px-6 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <Button onClick={onSave} disabled={saving} className="min-w-[140px]">
        {saving ? "Saving…" : label}
      </Button>
    </div>
  );
}
