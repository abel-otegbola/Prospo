const PAID_PLANS = new Set(["pro", "enterprise", "lifetime"]);
import { finalizePlanUpdate } from "../_lib/billing.js";

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const isPaidStatus = (status) => {
  if (!status || typeof status !== "string") {
    return false;
  }
  return ["paid", "completed", "succeeded", "success", "active"].includes(status.toLowerCase());
};

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId, targetPlan } = req.body || {};

  if (!sessionId || !targetPlan) {
    return res.status(400).json({ error: "Missing required fields: sessionId, targetPlan" });
  }

  if (!PAID_PLANS.has(targetPlan)) {
    return res.status(400).json({ error: "Only paid plans require Dodo verification" });
  }

  if (String(process.env.DODO_BYPASS_VERIFY).toLowerCase() === "true") {
    return res.status(200).json({ verified: true, status: "bypass", targetPlan });
  }

  const dodoApiKey = process.env.DODO_API_KEY;
  const dodoBaseUrl = process.env.DODO_API_BASE_URL || "https://api.dodopayments.com/v1";
  const verifyUrlTemplate = process.env.DODO_VERIFY_URL_TEMPLATE || "";

  if (!dodoApiKey) {
    return res.status(500).json({ error: "Missing DODO_API_KEY" });
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
      return res.status(502).json({
        error: data?.error || "Failed to verify Dodo checkout",
        details: data,
      });
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
      return res.status(402).json({
        verified: false,
        error: "Payment has not completed yet",
        status,
      });
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

    return res.status(200).json({
      verified: true,
      status,
      targetPlan,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to verify payment with Dodo",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
