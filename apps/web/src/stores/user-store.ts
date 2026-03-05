import createStore from "../common/store";
import { db } from "../common/db";
import BaseStore from "./index";
import {
  EVENTS,
  AuthenticatorType,
  User,
  SubscriptionPlan,
  SubscriptionStatus
} from "@notesfriend/core";
import Config from "../utils/config";
import { hashNavigate } from "../navigation";
import { ConfirmDialog } from "../dialogs/confirm";
import { OnboardingDialog } from "../dialogs/onboarding-dialog";
import { strings } from "@notesfriend/intl";
import { isUserSubscribed } from "../hooks/use-is-user-premium";
import { resetFeatures } from "../common";

class UserStore extends BaseStore<UserStore> {
  isLoggedIn?: boolean;
  isLoggingIn = false;
  isSigningIn = false;

  user?: User = undefined;
  counter = 0;

  init = () => {
    db.eventManager.subscribe(EVENTS.userSessionExpired, async () => {
      Config.set("sessionExpired", true);
      window.location.replace("/sessionexpired");
    });

    db.user.getUser().then((user) => {
      if (!user?.email) {
        this.set({ isLoggedIn: false });
        return;
      }
      this.set({
        user,
        isLoggedIn: true
      });
      if (Config.get("sessionExpired"))
        db.eventManager.publish(EVENTS.userSessionExpired);
    });

    if (Config.get("sessionExpired")) return;

    db.eventManager.subscribe(
      EVENTS.userSubscriptionUpdated,
      (subscription) => {
        const wasSubscribed = isUserSubscribed();
        this.refreshUser();
        this.set((state) => {
          if (!state.user) return;
          state.user.subscription = subscription;
        });
        if (!wasSubscribed && isUserSubscribed()) OnboardingDialog.show({});
        resetFeatures();
      }
    );

    db.eventManager.subscribe(EVENTS.userEmailConfirmed, () => {
      hashNavigate("/confirmed");
    });

    db.eventManager.subscribe(EVENTS.userLoggedOut, async (reason) => {
      this.set((state) => {
        state.user = undefined;
        state.isLoggedIn = false;
      });
      Config.logout();
      if (reason) {
        await ConfirmDialog.show({
          title: strings.loggedOut(),
          message: reason,
          negativeButtonText: strings.okay()
        });
      }
    });

    return db.user.fetchUser().then(async (user) => {
      if (!user) return false;

      this.set({
        user,
        isLoggedIn: true
      });

      return true;
    });
  };

  refreshUser = async () => {
    return db.user.fetchUser().then((user) => {
      this.set({ user });
    });
  };

  login = async (
    form:
      | { email: string }
      | { email: string; password: string }
      | { code: string; method: AuthenticatorType | "recoveryCode" },
    skipInit = false,
    sessionExpired = false
  ) => {
    this.set((state) => (state.isLoggingIn = true));

    try {
      if ("email" in form && !("password" in form)) {
        return await db.user.authenticateEmail(form.email);
      } else if ("code" in form) {
        const { code, method } = form;
        return await db.user.authenticateMultiFactorCode(code, method);
      } else if ("password" in form) {
        const { email, password } = form;
        await db.user.authenticatePassword(
          email,
          password,
          undefined,
          sessionExpired
        );
        Config.set("encryptBackups", true);

        if (skipInit) return true;
        return this.init();
      }
    } finally {
      this.set((state) => (state.isLoggingIn = false));
    }
  };

  tryDemo = async () => {
    const now = Date.now();
    await db.user.setUser({
      id: "demo-user-local",
      email: "demo@local.app",
      isEmailConfirmed: true,
      salt: "demo-salt-local-notesfriend",
      mfa: {
        isEnabled: false,
        primaryMethod: "email" as AuthenticatorType,
        remainingValidCodes: 0
      },
      subscription: {
        appId: 0,
        cancelURL: null,
        expiry: now + 365 * 24 * 60 * 60 * 1000,
        productId: null,
        provider: 0,
        start: now,
        plan: SubscriptionPlan.PRO,
        status: SubscriptionStatus.ACTIVE,
        updateURL: null,
        googlePurchaseToken: null
      }
    } as User);

    const user = await db.user.getUser();
    this.set({ user, isLoggedIn: true });
  };

  signup = (form: { email: string; password: string }) => {
    this.set((state) => (state.isSigningIn = true));
    return db.user
      .signup(form.email.toLowerCase(), form.password)
      .then(() => {
        return this.init();
      })
      .finally(() => {
        this.set((state) => (state.isSigningIn = false));
      });
  };
}

const [useStore, store] = createStore<UserStore>(
  (set, get) => new UserStore(set, get)
);
export { useStore, store };
