import React from "react";
import { AppFontSize } from "../../utils/size";
import Paragraph from "../ui/typography/paragraph";
import { BodyItemProps, getStyle } from "./functions";
import { DefaultAppStyles } from "../../utils/styles";

export const Description = (props: BodyItemProps) => {
  return (
    <Paragraph
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        ...getStyle(props.item.style),
        textAlign: props.inline ? "left" : props.item.style?.textAlign
      }}
      size={AppFontSize.sm}
    >
      {props.item.text}
    </Paragraph>
  );
};
