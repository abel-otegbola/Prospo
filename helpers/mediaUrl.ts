export type MediaProvider = "youtube" | "vimeo" | "cloudinary" | "direct" | "unknown";
export type MediaRenderType = "audio" | "video" | "iframe" | "none";

export interface MediaUrlResolution {
  provider: MediaProvider;
  renderType: MediaRenderType;
  normalizedUrl: string;
  isValid: boolean;
  error?: string;
}

const AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "m4a", "aac"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v", "ogv"];

function extractYouTubeId(url: URL): string | null {
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }

  if (host.includes("youtube.com")) {
    const watchId = url.searchParams.get("v");
    if (watchId) {
      return watchId;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (!pathParts.length) {
      return null;
    }

    if (pathParts[0] === "embed" || pathParts[0] === "shorts" || pathParts[0] === "live") {
      return pathParts[1] || null;
    }
  }

  return null;
}

function extractVimeoId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (!host.includes("vimeo.com")) {
    return null;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (!parts.length) {
    return null;
  }

  const knownVideoPrefix = parts[0] === "video" ? parts[1] : parts[0];
  const candidate = knownVideoPrefix || "";
  return /^\d+$/.test(candidate) ? candidate : null;
}

function normalizeCloudinaryMedia(url: URL): MediaUrlResolution | null {
  const host = url.hostname.toLowerCase();

  if (host.includes("res.cloudinary.com") && url.pathname.includes("/video/upload/")) {
    return {
      provider: "cloudinary",
      renderType: "video",
      normalizedUrl: url.toString(),
      isValid: true,
    };
  }

  return null;
}

function normalizeDirectMedia(url: URL): MediaUrlResolution | null {
  const path = url.pathname.toLowerCase();
  const ext = path.includes(".") ? path.split(".").pop()?.split("/")[0] ?? "" : "";

  if (AUDIO_EXTENSIONS.includes(ext)) {
    return {
      provider: "direct",
      renderType: "audio",
      normalizedUrl: url.toString(),
      isValid: true,
    };
  }

  if (VIDEO_EXTENSIONS.includes(ext)) {
    return {
      provider: "direct",
      renderType: "video",
      normalizedUrl: url.toString(),
      isValid: true,
    };
  }

  return null;
}

export function resolveMediaUrl(rawValue: string): MediaUrlResolution {
  const value = rawValue.trim();
  if (!value) {
    return {
      provider: "unknown",
      renderType: "none",
      normalizedUrl: "",
      isValid: true,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return {
      provider: "unknown",
      renderType: "none",
      normalizedUrl: value,
      isValid: false,
      error: "Enter a valid absolute URL.",
    };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      provider: "unknown",
      renderType: "none",
      normalizedUrl: value,
      isValid: false,
      error: "Only http/https URLs are supported.",
    };
  }

  const youtubeId = extractYouTubeId(parsed);
  if (youtubeId) {
    return {
      provider: "youtube",
      renderType: "iframe",
      normalizedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      isValid: true,
    };
  }

  const vimeoId = extractVimeoId(parsed);
  if (vimeoId) {
    return {
      provider: "vimeo",
      renderType: "iframe",
      normalizedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      isValid: true,
    };
  }

  const directMedia = normalizeDirectMedia(parsed);
  if (directMedia) {
    return directMedia;
  }

  const cloudinaryMedia = normalizeCloudinaryMedia(parsed);
  if (cloudinaryMedia) {
    return cloudinaryMedia;
  }

  return {
    provider: "unknown",
    renderType: "none",
    normalizedUrl: value,
    isValid: false,
    error: "Unsupported media URL. Use YouTube, Vimeo, Cloudinary, or direct audio/video file links.",
  };
}
