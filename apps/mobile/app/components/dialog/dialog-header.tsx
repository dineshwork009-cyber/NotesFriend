import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "@notesfriend/theme";
import { AppFontSize } from "../../utils/size";
import { Button, ButtonProps } from "../ui/button";
import { PressableProps } from "../ui/pressable";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";
import { DefaultAppStyles } from "../../utils/styles";

type DialogHeaderProps = {
  icon?: string;
  title?: string;
  paragraph?: string;
  button?: ButtonProps;
  paragraphColor?: string;
  padding?: number;
  centered?: boolean;
  titlePart?: string;
  style?: ViewStyle;
};

const DialogHeader = ({
  title,
  paragraph,
  button,
  paragraphColor,
  padding,
  centered,
  titlePart,
  style
}: DialogHeaderProps) => {
  const { colors } = useThemeColors();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 50,
          paddingHorizontal: padding,
          ...style
        }}
      >
        <View
          style={{
            width: "100%"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: centered ? "center" : "space-between",
              alignItems: "center"
            }}
          >
            <Heading
              style={{ textAlign: centered ? "center" : "left" }}
              size={AppFontSize.lg}
            >
              {title}{" "}
              {titlePart ? (
                <Text style={{ color: colors.primary.accent }}>
                  {titlePart}
                </Text>
              ) : null}
            </Heading>

            {button ? (
              <Button
                style={{
                  borderRadius: 100,
                  paddingHorizontal: DefaultAppStyles.GAP
                }}
                fontSize={13}
                type={button.type || "secondary"}
                height={30}
                {...button}
              />
            ) : null}
          </View>

          {paragraph ? (
            <Paragraph
              style={{
                textAlign: centered ? "center" : "left",
                maxWidth: centered ? "90%" : "100%",
                alignSelf: centered ? "center" : "flex-start"
              }}
              color={paragraphColor || colors.secondary.paragraph}
            >
              {paragraph}
            </Paragraph>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default DialogHeader;
