import { Plan, PlanMetadata } from "./types";
import { Period, set, SubscriptionPlan } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import { db } from "../../common/db";
import { usePromise } from "@notesfriend/common";

export const PLAN_METADATA: PlanMetadata = {
  [SubscriptionPlan.FREE]: {
    title: "Free",
    subtitle: "Get started without compromise."
  },
  [SubscriptionPlan.ESSENTIAL]: {
    title: "Essential",
    subtitle: "All the core features, minus the fluff."
  },
  [SubscriptionPlan.PRO]: {
    title: "Pro",
    subtitle: "Level up with more storage.",
    recommended: true
  },
  [SubscriptionPlan.BELIEVER]: {
    title: "Believer",
    subtitle: "Support the mission - unlock everything."
  },
  [SubscriptionPlan.EDUCATION]: {
    title: "Education",
    subtitle: ""
  },
  [SubscriptionPlan.LEGACY_PRO]: {
    title: "Pro (legacy)",
    subtitle: ""
  }
};

type PeriodMetadata = { title: string; refundDays: number };
export const PERIOD_METADATA: Record<Period, PeriodMetadata> = {
  monthly: {
    title: strings.monthly(),
    refundDays: 7
  },
  yearly: {
    title: strings.yearly(),
    refundDays: 14
  },
  "5-year": {
    title: "5 year",
    refundDays: 30
  }
};

export async function getPlans(): Promise<Plan[] | null> {
  const user = await db.user.getUser();
  const plans = await db.pricing.products(user?.subscription?.trialsAvailed);
  return plans.sort((a, b) => a.plan - b.plan);
}

export async function getAllPlans(): Promise<Plan[] | null> {
  const user = await db.user.getUser();
  const plans = await db.pricing.products();
  const plansWithoutTrials = await db.pricing.products(
    user?.subscription?.trialsAvailed
  );

  return set
    .union(plans, plansWithoutTrials, (item) => `${item.plan}${item.period}`)
    .sort((a, b) => a.plan - b.plan);
}

export function usePlans(options?: { loadAllPlans?: boolean }) {
  const result = usePromise(async () => {
    const plans = options?.loadAllPlans
      ? await getAllPlans()
      : await getPlans();
    if (!plans) return;
    return {
      plans,
      discount: Math.max(...plans.map((p) => p.discount?.amount || 0)),
      country: plans[0].country
    };
  });

  if (result.status === "pending") return { isLoading: true };
  if (result.status === "rejected") return { isLoading: false };

  return {
    isLoading: false,
    plans: result.value?.plans,
    discount: result.value?.discount,
    country: result.value?.country
  };
}
