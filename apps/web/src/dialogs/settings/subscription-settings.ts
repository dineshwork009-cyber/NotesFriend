import { SettingsGroup } from "./types";
import { SubscriptionStatus } from "./components/subscription-status";
import { showToast } from "../../utils/toast";
import { db } from "../../common/db";
import { BillingHistory } from "./components/billing-history";
import { useStore as useUserStore } from "../../stores/user-store";
import {
  isActiveSubscription,
  isUserSubscribed
} from "../../hooks/use-is-user-premium";
import { strings } from "@notesfriend/intl";
import {
  SubscriptionPlan,
  SubscriptionProvider,
  SubscriptionStatus as SubscriptionStatusEnum
} from "@notesfriend/core";
import { TaskManager } from "../../common/task-manager";
import { ConfirmDialog } from "../confirm";
import { ChangePlanDialog } from "../buy-dialog/change-plan-dialog";

export const SubscriptionSettings: SettingsGroup[] = [
  {
    key: "subscription",
    section: "subscription",
    header: SubscriptionStatus,
    onStateChange: (listener) =>
      useUserStore.subscribe((s) => s.user, listener),
    settings: [
      {
        key: "auto-renew",
        title: "Auto renew",
        description:
          "Toggle auto renew to avoid any surprise charges. If you do not turn auto renew back on, you'll be automatically downgraded to the Free plan at the end of your billing period.",
        isHidden: () => {
          const user = useUserStore.getState().user;
          const status = user?.subscription.status;
          return (
            user?.subscription.provider !== SubscriptionProvider.PADDLE ||
            user?.subscription.plan === SubscriptionPlan.EDUCATION ||
            !isUserSubscribed(user) ||
            status === SubscriptionStatusEnum.EXPIRED ||
            status === SubscriptionStatusEnum.TRIAL ||
            status === SubscriptionStatusEnum.CANCELED
          );
        },
        components: [
          {
            type: "toggle",
            isToggled: () => isActiveSubscription(),
            async toggle() {
              try {
                if (isActiveSubscription()) await db.subscriptions.pause();
                else await db.subscriptions.resume();
                useUserStore.setState((state) => {
                  state.user!.subscription.status = isActiveSubscription()
                    ? SubscriptionStatusEnum.PAUSED
                    : SubscriptionStatusEnum.ACTIVE;
                });
              } catch (e) {
                showToast("error", (e as Error).message);
              }
            }
          }
        ]
      },
      {
        key: "change-plan",
        title: "Change plan",
        description: "Change your subscription plan.",
        isHidden: () => {
          const user = useUserStore.getState().user;
          const status = user?.subscription.status;
          return (
            user?.subscription.plan === SubscriptionPlan.LEGACY_PRO ||
            user?.subscription.plan === SubscriptionPlan.EDUCATION ||
            user?.subscription.provider !== SubscriptionProvider.PADDLE ||
            !isUserSubscribed(user) ||
            status === SubscriptionStatusEnum.CANCELED ||
            status === SubscriptionStatusEnum.EXPIRED
          );
        },
        components: [
          {
            type: "button",
            title: "Change",
            variant: "secondary",
            action: async () => {
              ChangePlanDialog.show({});
            }
          }
        ]
      },
      {
        key: "payment-method",
        title: strings.paymentMethod(),
        description: strings.changePaymentMethodDescription(),
        isHidden: () => {
          const user = useUserStore.getState().user;
          const status = user?.subscription.status;
          return (
            user?.subscription.provider !== SubscriptionProvider.PADDLE ||
            !isUserSubscribed(user) ||
            status === SubscriptionStatusEnum.CANCELED ||
            status === SubscriptionStatusEnum.EXPIRED
          );
        },
        components: [
          {
            type: "button",
            title: strings.update(),
            action: async () => {
              try {
                const url = await db.subscriptions.updateUrl();
                if (!url)
                  throw new Error(
                    "Failed to get subscription update url. Please contact us at support@notesfriend.app so we can help you update your payment method."
                  );
                window.open(url, "_blank");
              } catch (e) {
                if (e instanceof Error) showToast("error", e.message);
              }
            },
            variant: "secondary"
          }
        ]
      },
      {
        key: "cancel-trial",
        title: "Cancel trial",
        description: `Cancel your trial to stop all future charges permanently. You will be immediately downgraded to the Free plan.`,
        isHidden: () => {
          const user = useUserStore.getState().user;
          const status = user?.subscription.status;
          return (
            user?.subscription.plan === SubscriptionPlan.LEGACY_PRO ||
            user?.subscription.provider !== SubscriptionProvider.PADDLE ||
            !isUserSubscribed(user) ||
            status !== SubscriptionStatusEnum.TRIAL
          );
        },
        components: [
          {
            type: "button",
            title: "Cancel",
            variant: "error",
            async action() {
              const cancelTrial = await ConfirmDialog.show({
                title: "Cancel trial?",
                message:
                  "Cancel your trial to stop all future charges permanently. You will be immediately downgraded to the Free plan.",
                negativeButtonText: "No",
                positiveButtonText: "Yes"
              });
              if (cancelTrial) {
                await TaskManager.startTask({
                  type: "modal",
                  title: "Cancelling your trial",
                  subtitle: "Please wait...",
                  action: () => db.subscriptions.cancel()
                })
                  .catch((e) => showToast("error", e.message))
                  .then(() =>
                    showToast("success", "Your trial has been canceled.")
                  );
              }
            }
          }
        ]
      },
      {
        key: "refund-subscription",
        title: "Refund subscription",
        description: `You will only be issued a refund if you are eligible as per our refund policy. Your account will immediately be downgraded to Basic and your funds will be transferred to your account within 24 hours.`,
        isHidden: () => {
          const user = useUserStore.getState().user;
          const status = user?.subscription.status;
          return (
            user?.subscription.provider !== SubscriptionProvider.PADDLE ||
            !isUserSubscribed(user) ||
            status === SubscriptionStatusEnum.TRIAL
          );
        },
        components: [
          {
            type: "button",
            title: "Refund",
            async action() {
              const refundSubscription = await ConfirmDialog.show({
                title: "Request refund?",
                message:
                  "You will only be issued a refund if you are eligible as per our refund policy. Your account will immediately be downgraded to Basic and your funds will be transferred to your account within 24 hours.",
                negativeButtonText: "No",
                positiveButtonText: "Yes",
                inputs: {
                  reason: {
                    title: "Reason for refund",
                    helpText: "Optional",
                    multiline: true
                  }
                }
              });
              if (refundSubscription) {
                const result = await TaskManager.startTask({
                  type: "modal",
                  title: "Requesting refund for your subscription",
                  subtitle: "Please wait...",
                  action: () =>
                    db.subscriptions.refund(refundSubscription.inputs?.reason)
                });
                if (result instanceof Error) {
                  showToast("error", result.message);
                  return;
                }
                showToast(
                  "success",
                  "Your refund request has been sent. If you are eligible for a refund, you'll receive your funds within 24 hours. Please wait at least 24 hours before reaching out to us in case there is any problem."
                );
              }
            },
            variant: "error"
          }
        ]
      },
      {
        key: "billing-history",
        title: strings.billingHistory(),
        isHidden: () => {
          const user = useUserStore.getState().user;
          return (
            user?.subscription.provider !== SubscriptionProvider.PADDLE ||
            !isUserSubscribed(user)
          );
        },
        components: [{ type: "custom", component: BillingHistory }]
      }
    ]
  }
];
