import { getAdminDb } from "./firebase-admin.js";

const ALLOWED_PLANS = new Set(["free", "pro", "enterprise", "lifetime"]);

export async function finalizePlanUpdate({ userId, targetPlan, source = "unknown", checkoutId = "" }) {
  if (!userId || typeof userId !== "string") {
    throw new Error("Missing userId");
  }

  if (!targetPlan || !ALLOWED_PLANS.has(targetPlan)) {
    throw new Error("Invalid target plan");
  }

  const adminDb = getAdminDb();
  const profileRef = adminDb.collection("userProfiles").doc(userId);

  await profileRef.set(
    {
      current_plan: targetPlan,
      billing: {
        lastUpdateSource: source,
        lastCheckoutId: checkoutId || null,
        updatedAt: new Date().toISOString(),
      },
      updatedAt: new Date(),
    },
    { merge: true },
  );

  return { userId, targetPlan };
}

export function extractPlanAndUserFromCheckoutPayload(payload) {
  const eventData = payload?.data || payload?.event?.data || payload?.checkout || payload || {};
  const metadata = eventData?.metadata || payload?.metadata || {};

  const userId = metadata?.userId || metadata?.user_id || eventData?.customer?.metadata?.userId || "";
  const targetPlan = metadata?.targetPlan || metadata?.target_plan || "";
  const checkoutId =
    eventData?.id ||
    eventData?.checkout_id ||
    payload?.id ||
    payload?.checkout_id ||
    payload?.data?.id ||
    "";

  return {
    userId: String(userId || "").trim(),
    targetPlan: String(targetPlan || "").trim(),
    checkoutId: String(checkoutId || "").trim(),
  };
}
