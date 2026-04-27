import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const testUrl = searchParams.get("url") || process.env.DODO_API_BASE_URL;

  if (!testUrl) {
    return NextResponse.json({ error: "Missing DODO_API_BASE_URL" }, { status: 400 });
  }

  try {
    console.log(`🧪 Testing connection to: ${testUrl}`);
    
    const response = await fetch(`${testUrl}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer test_key_12345`,
      },
      body: JSON.stringify({
        customer: { email: "test@example.com" },
        line_items: [],
      }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      body: data,
      url: testUrl,
      success: response.ok,
    });
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      code: error?.code,
      errno: error?.errno,
      syscall: error?.syscall,
      hostname: error?.hostname,
      url: testUrl,
    }, { status: 500 });
  }
}
