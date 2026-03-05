import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View, ViewProps } from "react-native";
import { useDelayLayout } from "../../hooks/use-delay-layout";
import { DefaultPlaceholder } from "./default-placeholder";
import { SettingsPlaceholder } from "./settings-placeholder";

interface IDelayLayoutProps extends ViewProps {
  delay?: number;
  wait?: boolean;
  type?: "default" | "settings";
  color?: string;
  animated?: boolean;
}

const placeholder = {
  default: DefaultPlaceholder,
  settings: SettingsPlaceholder
};

export default function DelayLayout({
  animated = true,
  ...props
}: IDelayLayoutProps) {
  const { colors } = useThemeColors();
  const loading = useDelayLayout(props.delay === undefined ? 200 : props.delay);
  const Placeholder = placeholder[props.type || "default"];

  return loading || props.wait ? (
    <View
      style={{
        backgroundColor: colors.primary.background,
        flex: 1,
        paddingTop: 20
      }}
    >
      <Placeholder color={props.color || colors.primary.accent} />
    </View>
  ) : (
    <>{props.children}</>
  );
}
