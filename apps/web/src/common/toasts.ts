import { FeatureResult } from "@notesfriend/common";
import { showToast } from "../utils/toast";
import { UpgradeDialog } from "../dialogs/buy-dialog/upgrade-dialog";

export function showFeatureNotAllowedToast(
  result: FeatureResult<any> | undefined
) {
  if (!result) return;
  showToast("error", result.error, [
    {
      text: "Upgrade",
      onClick: () =>
        UpgradeDialog.show({
          feature: result
        })
    }
  ]);
}
