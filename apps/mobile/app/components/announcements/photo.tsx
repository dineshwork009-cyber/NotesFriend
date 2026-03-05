import React from "react";
import { Image } from "react-native";
import { BodyItemProps, getStyle } from "./functions";

export const Photo = (props: BodyItemProps) => {
  return props.item.src ? (
    <Image
      source={{ uri: props.item.src }}
      resizeMode="cover"
      style={{
        width: "100%",
        height: 200,
        alignSelf: "center",
        ...getStyle(props.item.style)
      }}
    />
  ) : null;
};
