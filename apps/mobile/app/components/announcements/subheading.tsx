import React from "react";
import { AppFontSize } from "../../utils/size";
import Heading from "../ui/typography/heading";
import { BodyItemProps, getStyle } from "./functions";
import { DefaultAppStyles } from "../../utils/styles";

export const SubHeading = (props: BodyItemProps) => {
  return (
    <Heading
      size={AppFontSize.md + 2}
      style={{
        marginHorizontal: DefaultAppStyles.GAP,
        ...getStyle(props.item.style)
      }}
    >
      {props.item.text}
    </Heading>
  );
};
