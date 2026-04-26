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
    const { kind, publicId } = req.body || {};
    if (!publicId || (kind !== "image" && kind !== "video")) {
      res.status(400).json({ error: "Provide valid kind (image|video) and publicId" });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const resourceType = kind === "video" ? "video" : "image";
    const paramsToSign = {
      invalidate: true,
      public_id: publicId,
      timestamp,
    };

    const signature = createSignature(paramsToSign, apiSecret);
    const body = new URLSearchParams({
      public_id: publicId,
      invalidate: "true",
      timestamp: String(timestamp),
      api_key: apiKey,
      signature,
    });

    const destroyRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const payload = await destroyRes.json().catch(() => ({}));
    if (!destroyRes.ok || (payload?.result !== "ok" && payload?.result !== "not found")) {
      res.status(500).json({ error: payload?.error?.message || "Failed to delete Cloudinary asset" });
      return;
    }

    res.status(200).json({ success: true, result: payload?.result || "ok" });
  } catch (error) {
    res.status(500).json({
      error: "Unexpected delete error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
