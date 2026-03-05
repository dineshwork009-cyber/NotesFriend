import React from "react";
import { View } from "react-native";
import { useMessageStore } from "../../stores/use-message-store";
import { useThemeColors } from "@notesfriend/theme";
import { ColorValues } from "../../utils/colors";
import { hexToRGBA } from "../../utils/colors";
import { defaultBorderRadius } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";

export const DefaultPlaceholder = ({ color }: { color: string }) => {
  const { colors } = useThemeColors();
  const message = useMessageStore((state) => state.message);
  const annoucements = useMessageStore((state) => state.announcements);
  const hasAnnoucements = annoucements.length > 0;
  const shadeColor = color
    ? hexToRGBA(
        ColorValues[color?.toLowerCase() as keyof typeof ColorValues],
        0.15
      )
    : colors.primary.shade;

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: DefaultAppStyles.GAP
      }}
    >
      {hasAnnoucements ? (
        <View
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            marginBottom: 20,
            backgroundColor: colors.secondary.background,
            padding: DefaultAppStyles.GAP
          }}
        >
          <View
            style={{
              width: 150,
              height: 20,
              backgroundColor: colors.primary.hover,
              borderRadius: defaultBorderRadius,
              marginBottom: 10
            }}
          />
          <View
            style={{
              width: 250,
              height: 14,
              backgroundColor: colors.primary.hover,
              borderRadius: defaultBorderRadius
            }}
          />

          <View
            style={{
              width: 60,
              height: 15,
              backgroundColor: shadeColor,
              borderRadius: 3,
              marginTop: DefaultAppStyles.GAP_VERTICAL
            }}
          />
        </View>
      ) : null}

      {message ? (
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
              backgroundColor: shadeColor,
              borderRadius: 100,
              marginRight: 10
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
      ) : null}

      <View
        style={{
          width: "100%",
          height: 30,
          backgroundColor: colors.secondary.background,
          borderRadius: 10,
          marginBottom: 20,
          padding: DefaultAppStyles.GAP_SMALL,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 60,
            height: 15,
            backgroundColor: shadeColor,
            borderRadius: 3
          }}
        />

        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: colors.primary.hover,
              borderRadius: 100,
              marginRight: 10
            }}
          />
          <View
            style={{
              width: 60,
              height: 15,
              backgroundColor: colors.primary.hover,
              borderRadius: 3
            }}
          />
        </View>
      </View>

      <View
        style={{
          width: 200,
          height: 16,
          backgroundColor: colors.secondary.background,
          borderRadius: defaultBorderRadius
        }}
      />
      <View
        style={{
          width: "85%",
          height: 13,
          backgroundColor: colors.secondary.background,
          borderRadius: defaultBorderRadius,
          marginTop: DefaultAppStyles.GAP_VERTICAL
        }}
      />

      <View
        style={{
          flexDirection: "row",
          marginTop: DefaultAppStyles.GAP_VERTICAL
        }}
      >
        <View
          style={{
            width: 50,
            height: 10,
            backgroundColor: colors.secondary.background,
            borderRadius: defaultBorderRadius
          }}
        />
        <View
          style={{
            width: 60,
            height: 10,
            backgroundColor: colors.secondary.background,
            borderRadius: defaultBorderRadius,
            marginLeft: 10
          }}
        />
      </View>
    </View>
  );
};
