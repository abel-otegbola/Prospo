import crypto from "node:crypto";
import {
  extractPlanAndUserFromCheckoutPayload,
  finalizePlanUpdate,
} from "../_lib/billing.js";

const PAID_STATUSES = new Set(["paid", "completed", "succeeded", "success", "active"]);
const ACCEPTED_EVENTS = new Set([
  "checkout.completed",
  "payment.succeeded",
  "invoice.paid",
  "subscription.activated",
  "subscription.updated",
]);

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const safeEqual = (a, b) => {
  const aBuf = Buffer.from(String(a || ""));
  const bBuf = Buffer.from(String(b || ""));
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
};

function getRawBody(req) {
  if (typeof req.body === "string") {
    return req.body;
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString("utf8");
  }
  return JSON.stringify(req.body || {});
}

function verifySignature(req, rawBody) {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing DODO_WEBHOOK_SECRET");
  }

  const header =
    req.headers["x-dodo-signature"] ||
    req.headers["dodo-signature"] ||
    req.headers["x-webhook-signature"] ||
    "";

  if (!header) {
    return false;
  }

  const received = String(header).split(",").map((part) => part.trim());
  const candidates = received
    .map((item) => item.includes("=") ? item.split("=")[1] : item)
    .filter(Boolean);

  const computedHex = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return candidates.some((sig) => safeEqual(sig, computedHex));
}

function isPaid(payload) {
  const status =
    payload?.data?.payment_status ||
    payload?.data?.status ||
    payload?.payment_status ||
    payload?.status ||
    "";

  return PAID_STATUSES.has(String(status).toLowerCase());
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = getRawBody(req);

  try {
    if (String(process.env.DODO_BYPASS_VERIFY).toLowerCase() !== "true") {
      const verified = verifySignature(req, rawBody);
      if (!verified) {
        return res.status(401).json({ error: "Invalid webhook signature" });
      }
    }

    const payload = typeof req.body === "object" && req.body ? req.body : JSON.parse(rawBody || "{}");
    const eventType =
      payload?.event_type ||
      payload?.type ||
      payload?.event ||
      "unknown";

    if (!ACCEPTED_EVENTS.has(String(eventType))) {
      return res.status(200).json({ received: true, ignored: true, reason: "event_not_tracked" });
    }

    if (!isPaid(payload)) {
      return res.status(200).json({ received: true, ignored: true, reason: "payment_not_completed" });
    }

    const { userId, targetPlan, checkoutId } = extractPlanAndUserFromCheckoutPayload(payload);

    if (!userId || !targetPlan) {
      return res.status(400).json({ error: "Webhook missing userId or targetPlan metadata" });
    }

    await finalizePlanUpdate({
      userId,
      targetPlan,
      checkoutId,
      source: "dodo_webhook",
    });

    return res.status(200).json({ received: true, finalized: true, userId, targetPlan });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to process Dodo webhook",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
