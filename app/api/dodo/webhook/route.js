import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  extractPlanAndUserFromCheckoutPayload,
  finalizePlanUpdate,
} from "../../_lib/billing.js";

const PAID_STATUSES = new Set(["paid", "completed", "succeeded", "success", "active"]);
const ACCEPTED_EVENTS = new Set([
  "checkout.completed",
  "payment.succeeded",
  "invoice.paid",
  "subscription.activated",
  "subscription.updated",
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const safeEqual = (a, b) => {
  const aBuf = Buffer.from(String(a || ""));
  const bBuf = Buffer.from(String(b || ""));
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
};

function verifySignature(request, rawBody) {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing DODO_WEBHOOK_SECRET");
  }

  const header =
    request.headers.get("x-dodo-signature") ||
    request.headers.get("dodo-signature") ||
    request.headers.get("x-webhook-signature") ||
    "";

  if (!header) return false;

  const received = String(header).split(",").map((part) => part.trim());
  const candidates = received
    .map((item) => (item.includes("=") ? item.split("=")[1] : item))
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

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  const rawBody = await request.text();

  try {
    if (String(process.env.DODO_BYPASS_VERIFY).toLowerCase() !== "true") {
      const verified = verifySignature(request, rawBody);
      if (!verified) {
        return json({ error: "Invalid webhook signature" }, 401);
      }
    }

    const payload = rawBody ? JSON.parse(rawBody) : {};
    const eventType = payload?.event_type || payload?.type || payload?.event || "unknown";

    if (!ACCEPTED_EVENTS.has(String(eventType))) {
      return json({ received: true, ignored: true, reason: "event_not_tracked" }, 200);
    }

    if (!isPaid(payload)) {
      return json({ received: true, ignored: true, reason: "payment_not_completed" }, 200);
    }

    const { userId, targetPlan, checkoutId } =
      extractPlanAndUserFromCheckoutPayload(payload);

    if (!userId || !targetPlan) {
      return json({ error: "Webhook missing userId or targetPlan metadata" }, 400);
    }

    await finalizePlanUpdate({
      userId,
      targetPlan,
      checkoutId,
      source: "dodo_webhook",
    });

    return json({ received: true, finalized: true, userId, targetPlan }, 200);
  } catch (error) {
    return json(
      {
        error: "Failed to process Dodo webhook",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
}
