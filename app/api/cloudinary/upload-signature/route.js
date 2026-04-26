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
    const { kind, filename } = (await request.json().catch(() => ({}))) || {};
    if (kind !== "image" && kind !== "video") {
      return json({ error: "Invalid kind. Use image or video." }, 400);
    }

    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "case-studies";
    const timestamp = Math.floor(Date.now() / 1000);
    const resourceType = kind === "video" ? "video" : "image";
    const cleanedName = String(filename || "asset")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 60);
    const publicId = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanedName}`;

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };

    const signature = createSignature(paramsToSign, apiSecret);

    return json(
      {
        kind,
        cloudName,
        apiKey,
        timestamp,
        folder,
        publicId,
        resourceType,
        signature,
      },
      200,
    );
  } catch (error) {
    return json(
      {
        error: "Failed to create upload signature",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}
