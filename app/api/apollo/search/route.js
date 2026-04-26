import { NextResponse } from "next/server";

const HUNTER_API_URL = "https://api.hunter.io/v2";
const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const { domain, job_titles, department, seniority, limit = 25 } =
      (await request.json().catch(() => ({}))) || {};

    if (!domain) {
      return json({ error: "Domain is required" }, 400);
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
      domain: domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0],
      api_key: HUNTER_API_KEY,
      limit: limit.toString(),
    });

    if (job_titles) params.append("job_titles", job_titles);
    if (department) params.append("department", department);
    if (seniority) params.append("seniority", seniority);

    const response = await fetch(`${HUNTER_API_URL}/domain-search?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return json(
        {
          error:
            data.errors?.[0]?.details ||
            JSON.stringify(data) ||
            "Failed to search leads",
        },
        response.status,
      );
    }

    return json(data, 200);
  } catch (error) {
    return json({ error: error?.message || "Internal server error" }, 500);
  }
}
