export type CloudinaryUploadKind = "image" | "video";

interface UploadSignatureResponse {
  kind: CloudinaryUploadKind;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId: string;
  resourceType: "image" | "video";
  signature: string;
}

export interface CloudinaryUploadResult {
  kind: CloudinaryUploadKind;
  publicId: string;
  url: string;
}

const CLOUDINARY_API_URL = process.env.NEXT_PUBLIC_CLOUDINARY_API_URL || "/api/cloudinary";

async function getUploadSignature(kind: CloudinaryUploadKind, filename: string): Promise<UploadSignatureResponse> {
  const response = await fetch(`${CLOUDINARY_API_URL}/upload-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kind, filename }),
  });

  const data = await response.json().catch(() => ({ error: "Invalid server response" }));
  if (!response.ok) {
    throw new Error(data.error || `Upload signature failed (${response.status})`);
  }

  return data as UploadSignatureResponse;
}

export async function uploadFileToCloudinary(file: File, kind: CloudinaryUploadKind): Promise<CloudinaryUploadResult> {
  const signed = await getUploadSignature(kind, file.name);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.apiKey);
  form.append("timestamp", String(signed.timestamp));
  form.append("signature", signed.signature);
  form.append("folder", signed.folder);
  form.append("public_id", signed.publicId);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`, {
    method: "POST",
    body: form,
  });

  const payload = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok) {
    throw new Error(payload?.error?.message || "Cloudinary upload failed");
  }

  return {
    kind,
    publicId: payload.public_id,
    url: payload.secure_url,
  };
}

export async function deleteCloudinaryAsset(kind: CloudinaryUploadKind, publicId: string): Promise<void> {
  const response = await fetch(`${CLOUDINARY_API_URL}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kind, publicId }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Delete failed" }));
    throw new Error(data.error || `Delete failed (${response.status})`);
  }
}
