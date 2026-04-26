'use client';
import { useRef, useState, type DragEvent, type ClipboardEvent } from "react";
import {
  uploadFileToCloudinary,
  type CloudinaryUploadKind,
  type CloudinaryUploadResult,
} from "../../helpers/cloudinaryUpload";

interface CloudinaryDropUploadProps {
  kind: CloudinaryUploadKind;
  onUploaded: (result: CloudinaryUploadResult) => void;
  disabled?: boolean;
}

function getAllowedTypes(kind: CloudinaryUploadKind): string {
  return kind === "image" ? "image/*" : "video/*";
}

function isSupportedFile(kind: CloudinaryUploadKind, file: File): boolean {
  if (kind === "image") {
    return file.type.startsWith("image/");
  }

  return file.type.startsWith("video/");
}

export default function CloudinaryDropUpload({ kind, onUploaded, disabled = false }: CloudinaryDropUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file?: File) => {
    if (!file || disabled || uploading) {
      return;
    }

    if (!isSupportedFile(kind, file)) {
      setError(kind === "image" ? "Only image files are supported." : "Only video files are supported.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const result = await uploadFileToCloudinary(file, kind);
      onUploaded(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    await handleUpload(file);
  };

  const onPaste = async (event: ClipboardEvent<HTMLDivElement>) => {
    const item = Array.from(event.clipboardData.items).find((entry) => entry.kind === "file");
    if (!item) {
      return;
    }

    const file = item.getAsFile();
    await handleUpload(file || undefined);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onPaste={onPaste}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`w-full rounded-lg min-h-[200px] flex flex-col items-center justify-center border border-dashed px-3 py-4 text-sm transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-gray/[0.25]"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <p className="font-medium text-center">
          {uploading ? "Uploading..." : `Drag and drop, paste, or click to upload ${kind}`}
        </p>
        {error && <p className="text-center text-xs text-red-500 mt-4">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={getAllowedTypes(kind)}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          await handleUpload(file);
          event.target.value = "";
        }}
      />

    </div>
  );
}
