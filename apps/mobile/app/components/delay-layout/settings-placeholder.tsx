import React from "react";
import { View } from "react-native";
import { useThemeColors } from "@notesfriend/theme";
import { defaultBorderRadius } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";

export const SettingsPlaceholder = () => {
  const { colors } = useThemeColors();

  return (
    <View>
      <View
        style={{
          width: 100,
          height: 12,
          backgroundColor: colors.primary.shade,
          borderRadius: defaultBorderRadius,
          marginLeft: 12,
          marginBottom: 12
        }}
      />
      <View
        style={{
          width: "100%",
          height: 60,
          borderRadius: 10,
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: DefaultAppStyles.GAP
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: colors.primary.hover,
            borderRadius: 100,
            marginRight: 20
          }}
        />
        <View>
          <View
            style={{
              width: 150,
              height: 12,
              backgroundColor: colors.secondary.background,
              borderRadius: defaultBorderRadius,
              marginBottom: 10
            }}
          />
          <View
            style={{
              width: 250,
              height: 16,
              backgroundColor: colors.secondary.background,
              borderRadius: defaultBorderRadius
            }}
          />
        </View>
      </View>

      <View
        style={{
          width: "100%",
          height: 60,
          borderRadius: 10,
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: DefaultAppStyles.GAP,
          justifyContent: "space-between"
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: colors.primary.shade,
            borderRadius: 100,
            marginRight: 20
          }}
        />
        <View>
          <View
            style={{
              width: 150,
              height: 12,
              backgroundColor: colors.secondary.background,
              borderRadius: defaultBorderRadius,
              marginBottom: 10
            }}
          />
          <View
            style={{
              width: 250,
              height: 16,
              backgroundColor: colors.secondary.background,
              borderRadius: defaultBorderRadius
            }}
          />
        </View>

        <View
          style={{
            width: 40,
            height: 20,
            backgroundColor: colors.secondary.background,
            borderRadius: 100,
            marginLeft: 15,
            alignItems: "flex-end",
            justifyContent: "center",
            paddingHorizontal: 4
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: colors.primary.shade,
              borderRadius: 100,
              marginLeft: 15
            }}
          />
        </View>
      </View>
    </View>
  );
};
