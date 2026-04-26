import crypto from "crypto";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function createSignature(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return json(
      {
        error:
          "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET",
      },
      500,
    );
  }

  try {
    const { kind, publicId } = (await request.json().catch(() => ({}))) || {};
    if (!publicId || (kind !== "image" && kind !== "video")) {
      return json({ error: "Provide valid kind (image|video) and publicId" }, 400);
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

    const destroyRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    const payload = await destroyRes.json().catch(() => ({}));
    if (!destroyRes.ok || (payload?.result !== "ok" && payload?.result !== "not found")) {
      return json({ error: payload?.error?.message || "Failed to delete Cloudinary asset" }, 500);
    }

    return json({ success: true, result: payload?.result || "ok" }, 200);
  } catch (error) {
    return json(
      {
        error: "Unexpected delete error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}
