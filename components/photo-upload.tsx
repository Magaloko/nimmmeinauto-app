"use client";

import { useCallback, useRef, useState } from "react";

export interface UploadedPhoto {
  url: string;
  key: string;
}

interface Props {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  max?: number;
  labels?: string[];
}

const DEFAULT_LABELS = [
  "Vorne links",
  "Vorne rechts",
  "Hinten links",
  "Hinten rechts",
  "Innenraum",
  "Tacho",
];

export function PhotoUpload({ photos, onChange, max = 12, labels = DEFAULT_LABELS }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      const remaining = max - photos.length;
      const take = files.slice(0, remaining);

      setError(null);
      setUploading(true);
      setProgress({ done: 0, total: take.length });

      const uploaded: UploadedPhoto[] = [];
      for (let i = 0; i < take.length; i++) {
        const file = take[i];
        const fd = new FormData();
        fd.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = (await res.json()) as { url?: string; key?: string; error?: string };
          if (!res.ok || !data.url || !data.key) {
            setError(data.error ?? "Upload fehlgeschlagen.");
            break;
          }
          uploaded.push({ url: data.url, key: data.key });
        } catch {
          setError("Netzwerkfehler beim Upload.");
          break;
        } finally {
          setProgress({ done: i + 1, total: take.length });
        }
      }

      if (uploaded.length > 0) onChange([...photos, ...uploaded]);
      setUploading(false);
      setTimeout(() => setProgress(null), 1200);
    },
    [max, photos, onChange]
  );

  async function removePhoto(p: UploadedPhoto) {
    onChange(photos.filter((x) => x.key !== p.key));
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: p.key }),
      });
    } catch {
      /* ignore — tile already removed from UI */
    }
  }

  function onFilesSelected(fileList: FileList | null) {
    if (!fileList) return;
    uploadFiles(Array.from(fileList));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    uploadFiles(files);
  }

  const slotCount = Math.max(labels.length, photos.length + 1);
  const slots = Array.from({ length: Math.min(slotCount, max) });

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`grid grid-cols-3 gap-3 ${dragActive ? "ring-2 ring-primary/40 rounded-xl" : ""}`}
      >
        {slots.map((_, i) => {
          const photo = photos[i];
          const label = labels[i] ?? `Foto ${i + 1}`;

          if (photo) {
            return (
              <div
                key={photo.key}
                className="relative aspect-square rounded-xl overflow-hidden border border-border bg-stone-100 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  aria-label={`${label} entfernen`}
                  onClick={() => removePhoto(photo)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-medium px-2 py-1.5">
                  {label}
                </div>
              </div>
            );
          }

          const isNextSlot = i === photos.length;
          return (
            <button
              key={`slot-${i}`}
              type="button"
              aria-label={`Foto hinzufügen: ${label}`}
              onClick={() => isNextSlot && inputRef.current?.click()}
              disabled={!isNextSlot || uploading || photos.length >= max}
              className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                isNextSlot && !uploading
                  ? "border-stone-300 hover:border-primary/50 hover:bg-primary/5 cursor-pointer group"
                  : "border-stone-200 bg-stone-50 cursor-not-allowed opacity-60"
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-foreground-muted group-hover:text-primary group-hover:scale-110 transition-all"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-foreground-muted text-center px-2">Foto hinzufügen</span>
              <span className="text-xs text-foreground-muted/60 text-center px-2">{label}</span>
            </button>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="sr-only"
        onChange={(e) => {
          onFilesSelected(e.target.files);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span>
          {photos.length} / {max} Fotos · max. 10 MB pro Bild · JPG, PNG, WebP, HEIC
        </span>
        {photos.length < max && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-primary font-semibold hover:underline"
          >
            Dateien auswählen
          </button>
        )}
      </div>

      {uploading && progress && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-foreground-muted"
        >
          <svg aria-hidden="true" className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
          </svg>
          Lade {progress.done} von {progress.total} hoch…
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {error}
        </div>
      )}
    </div>
  );
}
