import React from "react";
import { View } from "react-native";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import Heading from "../ui/typography/heading";
import { BodyItemProps, getStyle } from "./functions";

export const Title = (props: BodyItemProps) => {
  return props.inline ? (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: props.inline ? DefaultAppStyles.GAP_VERTICAL_SMALL : 0
      }}
    >
      <Heading
        style={{
          paddingHorizontal: DefaultAppStyles.GAP,
          marginTop: DefaultAppStyles.GAP_VERTICAL,
          ...getStyle(props.item.style),
          textAlign: props.inline ? "left" : props.item.style?.textAlign,
          flexShrink: 1
        }}
        size={props.inline ? AppFontSize.md : AppFontSize.xl}
      >
        {props.item.text?.toUpperCase()}
      </Heading>
    </View>
  ) : (
    <Heading
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        ...getStyle(props.item.style)
      }}
    >
      {props.item.text}
    </Heading>
  );
};
