import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Paragraph from "../ui/typography/paragraph";
import { BodyItemProps, getStyle } from "./functions";
import { DefaultAppStyles } from "../../utils/styles";

export const List = (props: BodyItemProps) => {
  return (
    <View
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        paddingLeft: props.item.listType === "ordered" ? 25 : 25,
        ...getStyle(props.item.style)
      }}
    >
      {props.item.items?.map((item, index) => (
        <View
          key={item.text}
          style={{
            paddingVertical: DefaultAppStyles.GAP_VERTICAL,
            flexDirection: "row"
          }}
        >
          {props.item.listType === "ordered" ? (
            <Paragraph
              style={{
                marginRight: 5
              }}
            >
              {index + 1}.
            </Paragraph>
          ) : (
            <Icon size={20} name="circle-small" />
          )}
          <Paragraph>{item.text}</Paragraph>
        </View>
      ))}
    </View>
  );
};
