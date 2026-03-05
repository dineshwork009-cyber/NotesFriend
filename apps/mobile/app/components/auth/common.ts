import { createRef } from "react";
import { eSendEvent } from "../../services/event-manager";
import { eCloseLoginDialog } from "../../utils/events";
import Navigation from "../../services/navigation";
import { AuthParams } from "../../stores/use-navigation-store";
export const AuthMode = {
  login: 0,
  signup: 1,
  welcomeSignup: 2,
  welcomeLogin: 3,
  trialSignup: 4
};

export const initialAuthMode = createRef<number>();
initialAuthMode.current = AuthMode.login;
export function hideAuth(context?: AuthParams["context"]) {
  eSendEvent(eCloseLoginDialog);
  if (
    initialAuthMode.current === AuthMode.welcomeSignup ||
    initialAuthMode.current === AuthMode.welcomeLogin ||
    context === "intro"
  ) {
    Navigation.replace("FluidPanelsView", {});
  } else {
    Navigation.goBack();
  }
}
