import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { useUserStore } from "../../stores/use-user-store";
import { openLinkInBrowser } from "../../utils/functions";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { sleep } from "../../utils/time";
import { Button } from "../ui/button";
export const Synced = ({ item, close }) => {
  const { colors } = useThemeColors();
  const user = useUserStore((state) => state.user);
  const lastSynced = useUserStore((state) => state.lastSynced);
  return user && lastSynced >= item.dateModified ? (
    <Button
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        height: "auto",
        padding: DefaultAppStyles.GAP_VERTICAL_SMALL,
        paddingHorizontal: DefaultAppStyles.GAP_SMALL
      }}
      fontSize={AppFontSize.xxxs}
      iconSize={AppFontSize.xs}
      icon="shield-key-outline"
      type="shade"
      title="Encrypted and synced"
      onPress={async () => {
        try {
          close();
          await sleep(300);
          await openLinkInBrowser(
            "https://help.notesfriend.com/how-is-my-data-encrypted",
            colors
          );
        } catch (e) {
          console.error(e);
        }
      }}
    />
  ) : null;
};
