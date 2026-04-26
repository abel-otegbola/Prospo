import crypto from "crypto";

function createSignature(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET" });
    return;
  }

  try {
    const { kind, filename } = req.body || {};
    if (kind !== "image" && kind !== "video") {
      res.status(400).json({ error: "Invalid kind. Use image or video." });
      return;
    }

    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "case-studies";
    const timestamp = Math.floor(Date.now() / 1000);
    const resourceType = kind === "video" ? "video" : "image";
    const cleanedName = String(filename || "asset")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 60);
    // Cloudinary expects folder and public_id separately for predictable signature validation.
    const publicId = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanedName}`;

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };

    const signature = createSignature(paramsToSign, apiSecret);

    res.status(200).json({
      kind,
      cloudName,
      apiKey,
      timestamp,
      folder,
      publicId,
      resourceType,
      signature,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create upload signature",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
