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
      industries,
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

    let enhancedSearchTerm = searchTerm;
    if (!enhancedSearchTerm && Array.isArray(industries) && industries.length > 0) {
      enhancedSearchTerm = industries[0];
    }

    const requestBody = {
      q_organization_keyword_tags: [enhancedSearchTerm],
      page,
      per_page: Math.min(perPage, 10),
    };

    if (Array.isArray(companySize) && companySize.length > 0) {
      const sizeRanges = companySize
        .map((size) => size.replace("-", ","))
        .filter(Boolean);

      requestBody.organization_num_employees_ranges =
        sizeRanges.length > 0
          ? sizeRanges
          : ["1,20", "21,50", "51,100", "101,200"];
    } else if (typeof companySize === "string" && companySize.trim() !== "") {
      requestBody.organization_num_employees_ranges = [companySize.replace("-", ",")];
    } else {
      requestBody.organization_num_employees_ranges = [
        "1,20",
        "21,50",
        "51,100",
        "101,200",
      ];
    }

    if (location && location.trim() !== "") {
      requestBody.organization_locations = [location];
    }

    if (
      !requestBody.q_organization_keyword_tags ||
      requestBody.q_organization_keyword_tags.length === 0 ||
      !requestBody.q_organization_keyword_tags[0]
    ) {
      return json(
        {
          error: "Search term cannot be empty",
          receivedSearchTerm: searchTerm,
        },
        400,
      );
    }

    const response = await fetch("https://api.apollo.io/v1/organizations/search", {
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
          error: `Invalid parameters: ${data.error || data.message || "Apollo API rejected the request"}`,
          details: data,
          sentParams: requestBody,
        },
        response.status,
      );
    }

    return json(data, 200);
  } catch (error) {
    return json({ error: error?.message || "Internal server error" }, 500);
  }
}
