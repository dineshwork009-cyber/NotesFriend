import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import { AppFontSize, defaultBorderRadius } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import Paragraph from "../ui/typography/paragraph";
import { SideMenuHeader } from "./side-menu-header";

type SideMenuListEmptyProps = {
  placeholder: string;
  isLoading?: boolean;
};

export const SideMenuListEmpty = (props: SideMenuListEmptyProps) => {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <View
        style={{
          backgroundColor: colors.primary.background,
          paddingTop: DefaultAppStyles.GAP_VERTICAL
        }}
      >
        <SideMenuHeader />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1
        }}
      >
        {props.isLoading ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingHorizontal: DefaultAppStyles.GAP
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={"placeholder" + i}
                style={{
                  paddingVertical: DefaultAppStyles.GAP - 1,
                  width: i === 4 ? "80%" : "100%",
                  borderRadius: defaultBorderRadius,
                  backgroundColor: colors.secondary.background,
                  marginTop: DefaultAppStyles.GAP_VERTICAL,
                  opacity: 0.5
                }}
              />
            ))}
          </View>
        ) : (
          <Paragraph size={AppFontSize.xs} color={colors.secondary.paragraph}>
            {props.placeholder}
          </Paragraph>
        )}
      </View>
    </View>
  );
};
