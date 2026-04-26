import { resolveMediaUrl } from "../../helpers/mediaUrl";

interface MediaBlockPreviewProps {
  value: string;
}

export default function MediaBlockPreview({ value }: MediaBlockPreviewProps) {
  const media = resolveMediaUrl(value);

  if (!value) {
    return (
      <div className="h-[220px] rounded-lg border border-dashed border-gray/[0.25] flex items-center justify-center opacity-60">
        Add video/audio URL from the right panel
      </div>
    );
  }

  if (!media.isValid || !media.normalizedUrl) {
    return (
      <div className="h-[220px] rounded-lg border border-dashed border-red-500/30 bg-red-500/5 flex items-center justify-center px-4 text-center text-sm text-red-500">
        {media.error || "Invalid media URL"}
      </div>
    );
  }

  if (media.renderType === "audio") {
    return <audio controls src={media.normalizedUrl} className="w-full" />;
  }

  if (media.renderType === "video") {
    return <video controls src={media.normalizedUrl} className="w-full max-h-[420px] rounded-lg bg-black" />;
  }

  return (
    <iframe
      src={media.normalizedUrl}
      className="w-full h-[320px] rounded-lg border border-gray/[0.12]"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      title="Embedded media"
    />
  );
}
