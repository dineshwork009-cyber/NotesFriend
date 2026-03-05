import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { Dimensions, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Message, useMessageStore } from "../../stores/use-message-store";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { Pressable } from "../ui/pressable";
import Paragraph from "../ui/typography/paragraph";

export const Card = ({
  color,
  customMessage
}: {
  color?: string;
  customMessage?: Omit<Message, "data">;
}) => {
  const { colors } = useThemeColors();
  color = color ? color : colors.primary.accent;
  const messageBoardState = useMessageStore(
    (state) => customMessage || state.message
  );
  const announcements = useMessageStore((state) => state.announcements);
  const fontScale = Dimensions.get("window").fontScale;

  return !messageBoardState.visible ||
    (announcements && announcements.length) ? null : (
    <View
      style={{
        width: "100%",
        paddingHorizontal: DefaultAppStyles.GAP,
        paddingVertical: DefaultAppStyles.GAP_VERTICAL
      }}
    >
      <Pressable
        onPress={messageBoardState.onPress}
        type="plain"
        style={{
          paddingVertical: DefaultAppStyles.GAP_VERTICAL,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%"
          }}
        >
          <View
            style={{
              width: 40 * fontScale,
              height: 40 * fontScale,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              size={AppFontSize.xxxl}
              color={
                messageBoardState.type === "error" ? colors.error.icon : color
              }
              allowFontScaling
              name={messageBoardState.icon}
            />
          </View>

          <View
            style={{
              marginLeft: 10,
              marginRight: 10
            }}
          >
            <Paragraph
              style={{
                flexWrap: "nowrap",
                flexShrink: 1
              }}
              size={AppFontSize.sm}
              color={colors.primary.heading}
            >
              {messageBoardState.actionText}
            </Paragraph>
            <Paragraph color={colors.secondary.paragraph} size={AppFontSize.xs}>
              {messageBoardState.message}
            </Paragraph>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
