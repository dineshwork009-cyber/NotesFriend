import React from "react";
import { View } from "react-native";
import { useThemeColors } from "@notesfriend/theme";
import BaseDialog from "../../dialog/base-dialog";
import { ProgressBarComponent } from "../../ui/svg/lazy";
import { useEffect } from "react";
import {
  eSubscribeEvent,
  eUnSubscribeEvent
} from "../../../services/event-manager";
import { useState } from "react";
import { eCloseLoading, eOpenLoading } from "../../../utils/events";
import { DefaultAppStyles } from "../../../utils/styles";

export const LoadingDialog = () => {
  const { colors } = useThemeColors();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    eSubscribeEvent(eOpenLoading, open);
    eSubscribeEvent(eCloseLoading, close);
    return () => {
      eUnSubscribeEvent(eOpenLoading, open);
      eUnSubscribeEvent(eCloseLoading, close);
    };
  }, []);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return (
    <BaseDialog
      animated={false}
      bounce={false}
      visible={visible}
      onRequestClose={undefined}
      onShow={undefined}
      premium={undefined}
      transparent={undefined}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.primary.background,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: 100,
            marginTop: DefaultAppStyles.GAP
          }}
        >
          <ProgressBarComponent
            height={5}
            width={100}
            animated={true}
            useNativeDriver
            indeterminate
            indeterminateAnimationDuration={2000}
            unfilledColor={colors.secondary.background}
            color={colors.primary.accent}
            borderWidth={0}
          />
        </View>
      </View>
    </BaseDialog>
  );
};
