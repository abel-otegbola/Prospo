import { NextResponse } from "next/server";

const HUNTER_API_URL = "https://api.hunter.io/v2";
const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const first_name = searchParams.get("first_name");
    const last_name = searchParams.get("last_name");

    if (!domain || !first_name || !last_name) {
      return json(
        { error: "Domain, first_name, and last_name are required" },
        400,
      );
    }

    const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
    if (!HUNTER_API_KEY) {
      return json(
        {
          error:
            "API key not configured. Please add HUNTER_API_KEY to your Vercel environment variables.",
        },
        500,
      );
    }

    const params = new URLSearchParams({
      domain,
      first_name,
      last_name,
      api_key: HUNTER_API_KEY,
    });

    const response = await fetch(`${HUNTER_API_URL}/email-finder?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return json(
        { error: data.errors?.[0]?.details || "Failed to find email" },
        response.status,
      );
    }

    return json(data, 200);
  } catch (error) {
    return json({ error: error?.message || "Internal server error" }, 500);
  }
}
