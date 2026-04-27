import { NextResponse } from "next/server";

const PLAN_CONFIG = {
  pro: {
    label: "Pro",
    amountInCents: Number(process.env.DODO_PRO_PRICE_CENTS || 900),
    currency: process.env.DODO_CURRENCY || "USD",
    cadence: "monthly",
    productId: process.env.DODO_PRO_PRODUCT_ID || "",
  },
  enterprise: {
    label: "Enterprise",
    amountInCents: Number(process.env.DODO_ENTERPRISE_PRICE_CENTS || 2500),
    currency: process.env.DODO_CURRENCY || "USD",
    cadence: "monthly",
    productId: process.env.DODO_ENTERPRISE_PRODUCT_ID || "",
  },
  lifetime: {
    label: "Lifetime",
    amountInCents: Number(process.env.DODO_LIFETIME_PRICE_CENTS || 3900),
    currency: process.env.DODO_CURRENCY || "USD",
    cadence: "one_time",
    productId: process.env.DODO_LIFETIME_PRODUCT_ID || "",
  },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  const { userId, userEmail, targetPlan, currentPlan, origin } =
    (await request.json().catch(() => ({}))) || {};

  if (!userId || !userEmail || !targetPlan) {
    return json({ error: "Missing required fields: userId, userEmail, targetPlan" }, 400);
  }

  if (targetPlan === currentPlan) {
    return json({ error: "Target plan is already active" }, 400);
  }

  const plan = PLAN_CONFIG[targetPlan];
  if (!plan) {
    return json({ error: "Only paid plans support Dodo checkout" }, 400);
  }

  const dodoApiKey = process.env.DODO_API_KEY;
  const dodoBaseUrl = process.env.DODO_API_BASE_URL || "https://api.dodopayments.com/v1";

  if (!dodoApiKey) {
    return json({ error: "Missing DODO_API_KEY" }, 500);
  }

  const appOrigin =
    typeof origin === "string" && origin.startsWith("http")
      ? origin
      : process.env.APP_BASE_URL || "http://localhost:3000";

  const webhookUrl = process.env.DODO_WEBHOOK_URL || `${appOrigin}/api/dodo/webhook`;
  const successUrl = `${appOrigin}/account/settings?dodo_session_id={CHECKOUT_SESSION_ID}&target_plan=${encodeURIComponent(targetPlan)}`;
  const cancelUrl = `${appOrigin}/account/settings?billing=cancelled`;

  const lineItem = plan.productId
    ? { product_id: plan.productId, quantity: 1 }
    : {
        name: `Prospo ${plan.label} Plan`,
        amount: plan.amountInCents,
        currency: plan.currency,
        quantity: 1,
        recurring:
          plan.cadence === "monthly" ? { interval: "month", interval_count: 1 } : undefined,
      };

  const payload = {
    customer: {
      email: userEmail,
    },
    metadata: {
      userId,
      targetPlan,
      currentPlan: currentPlan || "free",
    },
    line_items: [lineItem],
    webhook_url: webhookUrl,
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  try {
    const url = `${dodoBaseUrl}/checkouts`;
    console.log("🔍 Dodo Checkout Request Debug:");
    console.log("URL:", url);
    console.log("API Key present:", !!dodoApiKey);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dodoApiKey}`,
      },
      body: JSON.stringify(payload),
      timeout: 10000, // 10 second timeout
    });

    const rawText = await response.text();
    const data = rawText ? JSON.parse(rawText) : {};

    console.log("Dodo Response Status:", response.status);
    console.log("Dodo Response:", data);

    if (!response.ok) {
      return json(
        {
          error: data?.error || "Failed to create Dodo checkout",
          details: data,
          status: response.status,
        },
        502,
      );
    }

    const checkoutUrl = data?.checkout_url || data?.url || data?.data?.url || data?.data?.checkout_url;
    const sessionId = data?.id || data?.checkout_id || data?.data?.id || data?.data?.checkout_id;

    if (!checkoutUrl) {
      return json({ error: "Dodo checkout URL missing in response", details: data }, 502);
    }

    return json(
      {
        checkoutUrl,
        sessionId: sessionId || null,
        targetPlan,
      },
      200,
    );
  } catch (error) {
    console.error("❌ Dodo API Error:", error);
    return json(
      {
        error: "Failed to contact Dodo checkout API",
        message: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack : "Unknown error",
      },
      500,
    );
  }
}
