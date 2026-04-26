import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { UserPlan } from "../interface/userProfile";

export type UsageCounterKey = "leads" | "case_studies";

type UsageLimits = {
  leads: number | null;
  case_studies: number | null;
};

const PLAN_LIMITS: Record<UserPlan, UsageLimits> = {
  free: { leads: 5, case_studies: 1 },
  pro: { leads: 50, case_studies: 5 },
  enterprise: { leads: null, case_studies: null },
  lifetime: { leads: 100, case_studies: 10 },
};

const PLAN_LABELS: Record<UserPlan, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
  lifetime: "Lifetime",
};

const RESOURCE_LABELS: Record<UsageCounterKey, string> = {
  leads: "lead",
  case_studies: "case study",
};

export async function assertUserWithinPlanLimit(userId: string, key: UsageCounterKey): Promise<void> {
  if (!userId) {
    throw new Error("You must be logged in to continue.");
  }

  const profileRef = doc(db, "userProfiles", userId);
  const profileSnapshot = await getDoc(profileRef);
  const profileData = profileSnapshot.exists() ? profileSnapshot.data() : {};
  const currentPlan = (profileData.current_plan || "free") as UserPlan;
  const currentUsage = (profileData.current_usage || {}) as {
    leads?: number;
    case_studies?: number;
  };

  const planLimits = PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free;
  const limit = planLimits[key];

  if (limit === null) {
    return;
  }

  const used = Number(currentUsage[key]) || 0;
  if (used >= limit) {
    const resourceLabel = RESOURCE_LABELS[key];
    const planLabel = PLAN_LABELS[currentPlan] || "current";
    throw new Error(`You've reached your ${planLabel} plan limit of ${limit} ${resourceLabel}${limit > 1 ? "s" : ""}. Upgrade your plan to continue.`);
  }
}

export async function incrementUserUsage(userId: string, key: UsageCounterKey, amount = 1): Promise<void> {
  if (!userId || amount === 0) {
    return;
  }

  const profileRef = doc(db, "userProfiles", userId);

  await runTransaction(db, async (transaction) => {
    const profileSnapshot = await transaction.get(profileRef);
    const profileData = profileSnapshot.exists() ? profileSnapshot.data() : {};
    const currentUsage = (profileData.current_usage || {}) as {
      leads?: number;
      case_studies?: number;
    };

    const nextUsage = {
      leads: Number(currentUsage.leads) || 0,
      case_studies: Number(currentUsage.case_studies) || 0,
    };

    nextUsage[key] = Math.max(0, nextUsage[key] + amount);

    transaction.set(
      profileRef,
      {
        current_usage: nextUsage,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
}
