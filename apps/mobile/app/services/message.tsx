import { strings } from "@notesfriend/intl";
import { Platform } from "react-native";
import { AuthMode } from "../components/auth/common";
import { verifyUser } from "../screens/settings/functions";
import {
  Message,
  MessageId,
  useMessageStore
} from "../stores/use-message-store";
import { eOpenRateDialog, eOpenRecoveryKeyDialog } from "../utils/events";
import { eSendEvent, presentSheet } from "./event-manager";
import Navigation from "./navigation";
import PremiumService from "./premium";
import SettingsService from "./settings";
import { Update } from "../components/sheets/update";
import { GithubVersionInfo } from "../utils/github-version";
import { CheckVersionResponse } from "react-native-check-version";

const APP_MESSAGES: Message[] = [
  {
    visible: true,
    message: strings.rateAppMessage(),
    actionText: strings.rateAppActionText(Platform.OS),
    onPress: () => {
      eSendEvent(eOpenRateDialog);
    },
    data: {},
    icon: "star",
    type: "normal",
    id: "rate-app"
  },
  {
    visible: true,
    message: strings.recoveryKeyMessage(),
    actionText: strings.recoveryKeyMessageActionText(),
    onPress: () => {
      verifyUser(
        null,
        () => {
          eSendEvent(eOpenRecoveryKeyDialog);
        },
        false,
        async () => {
          SettingsService.set({
            recoveryKeySaved: true
          });
          clearMessage();
        },
        "Cancel"
      );
    },
    data: {},
    icon: "key",
    type: "normal",
    id: "recovery-key"
  },
  {
    visible: true,
    message: strings.loginMessage(),
    actionText: strings.loginMessageActionText(),
    onPress: () => {
      Navigation.navigate("Auth", {
        mode: AuthMode.login
      });
    },
    data: {},
    icon: "account-outline",
    type: "normal",
    id: "log-in"
  },
  {
    visible: true,
    message: strings.syncDisabled(),
    actionText: strings.syncDisabledActionText(),
    onPress: () => {
      PremiumService.showVerifyEmailDialog();
    },
    data: {},
    icon: "email",
    type: "error",
    id: "confirm-email"
  }
];

function showMessageById(id: MessageId) {
  useMessageStore
    .getState()
    .setMessage(APP_MESSAGES.find((m) => m.id === id) as Message);
}

export function setRateAppMessage() {
  showMessageById("rate-app");
}

export function setRecoveryKeyMessage() {
  showMessageById("recovery-key");
}

export function setLoginMessage() {
  showMessageById("log-in");
}

export function setEmailVerifyMessage() {
  showMessageById("confirm-email");
}

export function clearMessage() {
  useMessageStore.getState().setMessage({
    ...useMessageStore.getState().message,
    visible: false
  });
}

const updateAvailableMessage = (
  version: GithubVersionInfo | CheckVersionResponse
) =>
  ({
    visible: true,
    message: strings.newUpdateMessage(),
    actionText: strings.newUpdateActionText(),
    onPress: () => {
      presentSheet({
        component: (ref) => <Update version={version} fwdRef={ref} />
      });
    },
    data: {},
    icon: "update",
    type: "normal",
    id: "app-update"
  }) as Message;

export function setUpdateAvailableMessage(
  version: GithubVersionInfo | CheckVersionResponse
) {
  useMessageStore.getState().setMessage(updateAvailableMessage(version));
}
