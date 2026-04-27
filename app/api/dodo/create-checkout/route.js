import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

const PLAN_CONFIG = {
  pro: {
    label: "Pro",
    productId: process.env.DODO_PRO_PRODUCT_ID || "",
  },
  enterprise: {
    label: "Enterprise",
    productId: process.env.DODO_ENTERPRISE_PRODUCT_ID || "",
  },
  lifetime: {
    label: "Lifetime",
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

  const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY || process.env.DODO_API_KEY;
  const dodoEnvironment =
    process.env.DODO_PAYMENTS_ENVIRONMENT ||
    (process.env.NODE_ENV === "development" ? "test_mode" : "live_mode");

  if (!dodoApiKey) {
    return json({ error: "Missing DODO_PAYMENTS_API_KEY" }, 500);
  }

  if (!plan.productId) {
    return json(
      {
        error: `Missing product id for ${targetPlan} plan`,
        details: `Set DODO_${targetPlan.toUpperCase()}_PRODUCT_ID in your environment.`,
      },
      500,
    );
  }

  const appOrigin =
    typeof origin === "string" && origin.startsWith("http")
      ? origin
      : process.env.APP_BASE_URL || "http://localhost:3000";

  const returnUrl = `${appOrigin}/account/settings?target_plan=${encodeURIComponent(targetPlan)}`;
  const cancelUrl = `${appOrigin}/account/settings?billing=cancelled`;

  const createCheckoutSession = async (environment) => {
    const client = new DodoPayments({
      bearerToken: dodoApiKey,
      environment,
    });

    return client.checkoutSessions.create({
      product_cart: [{ product_id: plan.productId, quantity: 1 }],
      customer: {
        email: userEmail,
      },
      metadata: {
        userId,
        targetPlan,
        currentPlan: currentPlan || "free",
      },
      return_url: returnUrl,
      cancel_url: cancelUrl,
    });
  };

  try {
    const fallbackEnvironment = dodoEnvironment === "test_mode" ? "live_mode" : "test_mode";
    let session;

    try {
      session = await createCheckoutSession(dodoEnvironment);
    } catch (error) {
      const status = error && typeof error === "object" ? error.status : undefined;
      const isUnauthorized = status === 401;

      if (!isUnauthorized || fallbackEnvironment === dodoEnvironment) {
        throw error;
      }

      console.warn(
        `Dodo checkout failed in ${dodoEnvironment} with 401. Retrying in ${fallbackEnvironment}.`,
      );
      session = await createCheckoutSession(fallbackEnvironment);
    }

    return json(
      {
        checkoutUrl: session.checkout_url || null,
        checkout_url: session.checkout_url || null,
        sessionId: session.session_id,
        session_id: session.session_id,
        targetPlan,
        environment: dodoEnvironment,
      },
      200,
    );
  } catch (error) {
    console.error("❌ Dodo SDK Error:", error);
    return json(
      {
        error: "Failed to create Dodo checkout session",
        message: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack : "Unknown error",
      },
      500,
    );
  }
}
