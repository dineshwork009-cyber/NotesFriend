import { useThemeColors } from "@notesfriend/theme";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { IconButton } from "../ui/icon-button";
import { hideAuth } from "./common";
import { AuthParams } from "../../stores/use-navigation-store";
export const AuthHeader = (props: { welcome?: boolean }) => {
  const { colors } = useThemeColors();
  const route = useRoute();

  return (
    <View
      style={{
        width: "100%"
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          width: "100%",
          height: 50,
          justifyContent: !props.welcome ? "space-between" : "flex-end"
        }}
      >
        {props.welcome ? null : (
          <IconButton
            name="arrow-left"
            onPress={() => {
              hideAuth((route.params as AuthParams)?.context);
            }}
            color={colors.primary.paragraph}
          />
        )}

        {!props.welcome ? null : (
          <Button
            title="Skip"
            onPress={() => {
              hideAuth();
            }}
            iconSize={16}
            type="plain"
            iconPosition="right"
            icon="chevron-right"
            height={25}
            iconStyle={{
              marginTop: 2
            }}
            style={{
              paddingHorizontal: 6
            }}
          />
        )}
      </View>
    </View>
  );
};
