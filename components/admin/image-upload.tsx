"use client";

import { useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openPicker() {
    if (!uploading) inputRef.current?.click();
  }

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const data = (await res.json().catch(() => null)) as {
        publicUrl?: string;
        error?: string;
      } | null;

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      if (!data?.publicUrl) {
        throw new Error("Upload succeeded but no URL was returned");
      }

      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2 sm:col-span-2", className)}>
      <Label>{label}</Label>
      <div className="flex items-start gap-3 sm:gap-4">
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          aria-label={value ? "Replace image" : "Upload image"}
          className="group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--hairline)] bg-[var(--surface-2)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-24 sm:w-24"
        >
          {value ? (
            <>
              <Image src={value} alt="" fill className="object-cover" unoptimized />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:bg-black/45 group-hover:opacity-100">
                Replace
              </span>
            </>
          ) : (
            <Upload size={18} className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={uploading}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              onClick={openPicker}
            >
              {uploading ? "Uploading…" : value ? "Replace image" : "Choose image"}
            </Button>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={() => onChange(null)}
              >
                <X size={14} />
                Remove
              </Button>
            ) : null}
          </div>

          <input
            type="url"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="Or paste a URL"
            className="h-10 w-full rounded-lg border border-[var(--hairline)] bg-[var(--surface)] px-3 text-base sm:h-9 sm:text-xs"
          />
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
          <p className="text-xs text-[var(--muted-foreground)]">
            Click the preview or button to upload. JPG, PNG, WebP, GIF, SVG up to 5MB.
          </p>
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
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-[var(--hairline)] bg-[var(--bg)]/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:-mx-6 sm:px-6 sm:py-4 lg:-mx-8 lg:px-8">
      <Button
        onClick={onSave}
        disabled={saving}
        className="w-full sm:w-auto sm:min-w-[140px]"
      >
        {saving ? "Saving…" : label}
      </Button>
    </div>
  );
}
