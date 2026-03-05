import InAppReview from "react-native-in-app-review";
import { DatabaseLogger } from "../common/database";
import { MMKV } from "../common/database/mmkv";
import Config from "react-native-config";
import { useUserStore } from "../stores/use-user-store";

const day_ms = 86400000;
export function requestInAppReview() {
  if (Config.GITHUB_RELEASE === "true") return;

  const time = MMKV.getMap<{ timestamp: number }>("requestInAppReview");

  if (time?.timestamp && time?.timestamp + day_ms * 7 > Date.now()) {
    return;
  }

  if (InAppReview.isAvailable()) {
    useUserStore.getState().setDisableAppLockRequests(true);

    InAppReview.RequestInAppReview()
      .then(() => {
        setTimeout(() => {
          useUserStore.getState().setDisableAppLockRequests(false);
        }, 1000);
      })
      .catch((error) => {
        DatabaseLogger.error(error);
      });
    MMKV.setMap("requestInAppReview", { timestamp: Date.now() });
  } else {
    DatabaseLogger.error(new Error("In App Review not available"));
  }
}
