import React from "react";
import Paragraph from "../ui/typography/paragraph";
import { BodyItemProps, getStyle } from "./functions";
import { DefaultAppStyles } from "../../utils/styles";

export const Body = (props: BodyItemProps) => {
  return (
    <Paragraph
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        ...getStyle(props.item.style)
      }}
    >
      {props.item.text}
    </Paragraph>
  );
};
