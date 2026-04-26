import { NextResponse } from "next/server";

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
    const {
      searchTerm,
      location,
      page = 1,
      perPage = 25,
      companySize,
      jobTitles = ["founder", "ceo", "owner", "director", "manager"],
    } = (await request.json().catch(() => ({}))) || {};

    if (!searchTerm) {
      return json({ error: "Search term is required" }, 400);
    }

    const APOLLO_API_KEY =
      process.env.APOLLO_API_KEY || process.env.VITE_APOLLO_API_KEY;
    if (!APOLLO_API_KEY) {
      return json(
        {
          error:
            "API key not configured. Please add APOLLO_API_KEY to your Vercel environment variables.",
        },
        500,
      );
    }

    const requestBody = {
      q_keywords: searchTerm,
      page,
      per_page: Math.min(perPage, 10),
      person_titles: jobTitles,
    };

    if (companySize) {
      requestBody.organization_num_employees_ranges = [companySize];
    } else {
      requestBody.organization_num_employees_ranges = [
        "1,20",
        "21,50",
        "51,100",
        "101,200",
      ];
    }

    if (location) {
      requestBody.person_locations = [location];
    }

    const response = await fetch("https://api.apollo.io/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": APOLLO_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return json(
        {
          error: data.error || data.message || "Failed to search people",
          details: data,
        },
        response.status,
      );
    }

    return json(data, 200);
  } catch (error) {
    return json({ error: error?.message || "Internal server error" }, 500);
  }
}
