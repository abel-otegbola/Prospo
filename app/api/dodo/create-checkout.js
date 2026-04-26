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

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, userEmail, targetPlan, currentPlan, origin } = req.body || {};

  if (!userId || !userEmail || !targetPlan) {
    return res.status(400).json({ error: "Missing required fields: userId, userEmail, targetPlan" });
  }

  if (targetPlan === currentPlan) {
    return res.status(400).json({ error: "Target plan is already active" });
  }

  const plan = PLAN_CONFIG[targetPlan];
  if (!plan) {
    return res.status(400).json({ error: "Only paid plans support Dodo checkout" });
  }

  const dodoApiKey = process.env.DODO_API_KEY;
  const dodoBaseUrl = process.env.DODO_API_BASE_URL || "https://api.dodopayments.com/v1";

  if (!dodoApiKey) {
    return res.status(500).json({ error: "Missing DODO_API_KEY" });
  }

  const appOrigin = typeof origin === "string" && origin.startsWith("http")
    ? origin
    : (process.env.APP_BASE_URL || "http://localhost:3000");
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
      recurring: plan.cadence === "monthly" ? { interval: "month", interval_count: 1 } : undefined,
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
    const response = await fetch(`${dodoBaseUrl}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dodoApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    const data = rawText ? JSON.parse(rawText) : {};

    if (!response.ok) {
      return res.status(502).json({
        error: data?.error || "Failed to create Dodo checkout",
        details: data,
      });
    }

    const checkoutUrl = data?.checkout_url || data?.url || data?.data?.url || data?.data?.checkout_url;
    const sessionId = data?.id || data?.checkout_id || data?.data?.id || data?.data?.checkout_id;

    if (!checkoutUrl) {
      return res.status(502).json({ error: "Dodo checkout URL missing in response", details: data });
    }

    return res.status(200).json({
      checkoutUrl,
      sessionId: sessionId || null,
      targetPlan,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to contact Dodo checkout API",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
