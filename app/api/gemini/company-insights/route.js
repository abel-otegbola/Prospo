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
  const { lead } = (await request.json().catch(() => ({}))) || {};
  if (!lead) {
    return json({ error: "Missing lead in request body" }, 400);
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  const model = "gemini-2.5-flash";
  if (!apiKey) {
    return json({ error: "Missing GOOGLE_GEMINI_API_KEY env variable" }, 500);
  }

  const company = lead.company || "";
  const website = lead.companyWebsite || "";
  const industry = lead.industry || "";
  const location = lead.location || "";

  const parseRetryDelaySeconds = (errorBody) => {
    const retry = errorBody?.error?.details?.find((d) => d?.["@type"]?.includes("RetryInfo"));
    const retryDelay = retry?.retryDelay;
    if (!retryDelay || typeof retryDelay !== "string") return null;
    const value = Number.parseInt(retryDelay.replace("s", ""), 10);
    return Number.isNaN(value) ? null : value;
  };

  const prompt = `You are a sharp B2B research assistant helping a freelancer start meaningful cold outreach conversations.

Research this company using web knowledge and (if available) public website context.
Company: ${company}
Website: ${website || "N/A"}
Industry: ${industry || "N/A"}
Location: ${location || "N/A"}

Return ONLY valid JSON (no markdown, no extra text) with this exact shape:
{
  "summary": "2-4 sentence overview of what they do and who they likely serve",
  "whatTheyOffer": ["2-3 concise offerings"],
  "whatIsUnique": ["2-3 unique differentiators"],
  "improvements": ["2-3 thoughtful improvement ideas for growth, positioning, website, or conversion"],
  "conversationAngles": ["1-3 meaningful outreach angles that create conversation without pitching hard"],
  "confidence": "low|medium|high"
}

Rules:
- Be specific and practical.
- Avoid generic buzzwords.
- Use simple language that a non-expert can understand.
- Use LinkedIn and other social media context as well.
- If website details are limited, infer cautiously and lower confidence.
- Keep items concise and conversation-ready.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const rawText = await response.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      return json(
        {
          error: "Failed to parse Gemini response JSON",
          status: response.status,
          statusText: response.statusText,
          rawBody: rawText,
        },
        502,
      );
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseRetryDelaySeconds(data);
        return json(
          {
            insights: {
              summary: `${company || "This company"} appears to operate in ${industry || "its market"} with limited retrievable detail at the moment.`,
              whatTheyOffer: [
                "Core offering could not be confidently resolved due to temporary quota limits.",
              ],
              whatIsUnique: [
                "Differentiators unavailable while AI provider quota is temporarily exceeded.",
              ],
              improvements: [
                "Retry analysis later to retrieve deeper website and market-specific opportunities.",
              ],
              conversationAngles: [
                "Reference a recent company update and ask one discovery question about priorities.",
              ],
              confidence: "low",
            },
            fallback: true,
            reason: "quota_exceeded",
            retryAfterSeconds: retryAfter,
          },
          200,
        );
      }

      return json(
        {
          error: "Gemini API returned non-OK status",
          status: response.status,
          statusText: response.statusText,
          body: data,
        },
        502,
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return json({ error: "Invalid AI response shape", body: data }, 502);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return json({ error: "Model did not return valid JSON", raw: text }, 502);
    }

    return json({ insights: parsed }, 200);
  } catch (err) {
    return json(
      {
        error: "Generation failed",
        message: err && err.message ? err.message : String(err),
        stack: err && err.stack ? err.stack : undefined,
      },
      500,
    );
  }
}
