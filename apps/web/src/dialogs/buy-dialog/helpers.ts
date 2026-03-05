import { getFeature } from "@notesfriend/common";
import { Period, Plan, SubscriptionPlan, User } from "@notesfriend/core";
import { PricingInfo } from "./types";
import { getCurrencySymbol } from "../../common/currencies";

export const IS_DEV = import.meta.env.DEV || IS_TESTING;

export function parseAmount(amount: string) {
  const matches = /(.+?)([\d.]+)/.exec(amount);
  if (!matches || matches.length < 3) return;
  return {
    formatted: amount,
    symbol: matches[1],
    amount: parseFloat(matches[2])
  };
}

export const FEATURE_HIGHLIGHTS = [
  getFeature("storage"),
  getFeature("fileSize"),
  getFeature("colors"),
  getFeature("notebooks"),
  getFeature("fullQualityImages"),
  getFeature("appLock")
];

const TRIAL_PERIODS: Record<Period, number> = {
  yearly: 14,
  monthly: 7,
  "5-year": 30
};

export function toPricingInfo(plan: Plan, user: User | undefined): PricingInfo {
  return {
    country: plan.country,
    period: plan.period,
    price: {
      currency: plan.currency,
      id: plan.id,
      period: plan.period,
      subtotal: formatPrice(plan.price.net, plan.currency),
      tax: formatPrice(plan.price.tax, plan.currency),
      total: formatPrice(plan.price.gross, plan.currency),
      trial_period: isTrialAvailableForPlan(plan.plan, user)
        ? {
            frequency: TRIAL_PERIODS[plan.period]
          }
        : undefined
    },
    discount: plan.discount,
    coupon: plan.discount?.code,
    recurringPrice: plan.recurring
      ? {
          currency: plan.currency,
          id: plan.id,
          period: plan.period,
          subtotal: formatPrice(plan.price.net, plan.currency),
          tax: formatPrice(plan.price.tax, plan.currency),
          total: formatPrice(plan.price.gross, plan.currency)
        }
      : undefined
  };
}

export function isTrialAvailableForPlan(
  plan: SubscriptionPlan,
  user: User | undefined
) {
  if (plan === SubscriptionPlan.EDUCATION) return false;
  return (
    !user?.subscription.trialsAvailed ||
    !user?.subscription.trialsAvailed?.includes(plan)
  );
}

export function formatPrice(price: number, currency: string) {
  return `${getCurrencySymbol(currency)}${price.toFixed(2)}`;
}
