import { useTimeAgo } from "@notesfriend/common";
import React from "react";
import { TextProps } from "react-native";
import Heading from "../typography/heading";
import Paragraph from "../typography/paragraph";
interface TimeSinceProps extends TextProps {
  updateFrequency: number;
  time: number;
  bold?: boolean;
}

export const TimeSince = ({
  time,
  style,
  updateFrequency = 30000,
  bold
}: TimeSinceProps) => {
  const timeAgo = useTimeAgo(time, {
    interval: updateFrequency,
    locale: "short"
  });

  return bold ? (
    <Heading style={style}>{timeAgo}</Heading>
  ) : (
    <Paragraph style={style}>{timeAgo}</Paragraph>
  );
};
