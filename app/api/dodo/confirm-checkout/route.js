import { NextResponse } from "next/server";
import { finalizePlanUpdate } from "../../_lib/billing.js";

const PAID_PLANS = new Set(["pro", "enterprise", "lifetime"]);
const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const isPaidStatus = (status) => {
  if (!status || typeof status !== "string") return false;
  return ["paid", "completed", "succeeded", "success", "active"].includes(
    status.toLowerCase(),
  );
};

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  const { sessionId, targetPlan } = (await request.json().catch(() => ({}))) || {};

  if (!sessionId || !targetPlan) {
    return json({ error: "Missing required fields: sessionId, targetPlan" }, 400);
  }

  if (!PAID_PLANS.has(targetPlan)) {
    return json({ error: "Only paid plans require Dodo verification" }, 400);
  }

  if (String(process.env.DODO_BYPASS_VERIFY).toLowerCase() === "true") {
    return json({ verified: true, status: "bypass", targetPlan }, 200);
  }

  const dodoApiKey = process.env.DODO_API_KEY;
  const dodoBaseUrl = process.env.DODO_API_BASE_URL || "https://api.dodopayments.com/v1";
  const verifyUrlTemplate = process.env.DODO_VERIFY_URL_TEMPLATE || "";

  if (!dodoApiKey) {
    return json({ error: "Missing DODO_API_KEY" }, 500);
  }

  const verifyUrl = verifyUrlTemplate
    ? verifyUrlTemplate.replace("{SESSION_ID}", encodeURIComponent(sessionId))
    : `${dodoBaseUrl}/checkouts/${encodeURIComponent(sessionId)}`;

  try {
    const response = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dodoApiKey}`,
      },
    });

    const rawText = await response.text();
    const data = rawText ? JSON.parse(rawText) : {};

    if (!response.ok) {
      return json(
        {
          error: data?.error || "Failed to verify Dodo checkout",
          details: data,
        },
        502,
      );
    }

    const status =
      data?.payment_status ||
      data?.status ||
      data?.checkout_status ||
      data?.data?.payment_status ||
      data?.data?.status ||
      data?.data?.checkout_status ||
      "unknown";

    if (!isPaidStatus(status)) {
      return json(
        {
          verified: false,
          error: "Payment has not completed yet",
          status,
        },
        402,
      );
    }

    const metadata = data?.metadata || data?.data?.metadata || {};
    const userId = metadata?.userId || metadata?.user_id || "";

    if (userId) {
      await finalizePlanUpdate({
        userId,
        targetPlan,
        checkoutId: sessionId,
        source: "checkout_confirm",
      });
    }

    return json({ verified: true, status, targetPlan }, 200);
  } catch (error) {
    return json(
      {
        error: "Unable to verify payment with Dodo",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
}
