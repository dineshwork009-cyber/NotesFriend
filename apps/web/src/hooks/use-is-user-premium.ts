import { SubscriptionPlan, SubscriptionStatus, User } from "@notesfriend/core";
import { useStore as useUserStore } from "../stores/user-store";

export function isActiveSubscription(user?: User) {
  user = user || useUserStore.getState().user;
  if (!user) return false;

  const { status } = user?.subscription || {};

  return (
    status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.TRIAL
  );
}
export function isUserSubscribed(user?: User) {
  user = user || useUserStore.getState().user;
  if (!user) return false;

  const { expiry, plan, status } = user?.subscription || {};
  if (!expiry) return false;

  return (
    plan !== SubscriptionPlan.FREE && status !== SubscriptionStatus.EXPIRED
  );
}
