import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ProgressBarComponent } from "../ui/svg/lazy";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";
export const Loading = (props: {
  title?: string;
  description?: string;
  icon?: string;
}) => {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.primary.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16
      }}
    >
      {props.icon ? (
        <Icon name={props.icon} size={80} color={colors.primary.accent} />
      ) : null}

      {props.title ? (
        <Heading
          style={{
            textAlign: "center"
          }}
        >
          {props.title}
        </Heading>
      ) : null}

      {props.description ? (
        <Paragraph
          style={{
            textAlign: "center"
          }}
        >
          {props.description}
        </Paragraph>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          width: 100,
          marginTop: 15
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
  );
};
