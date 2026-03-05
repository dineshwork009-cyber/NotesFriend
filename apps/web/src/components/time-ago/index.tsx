import React, { useRef } from "react";
import { Text, TextProps } from "@theme-ui/components";
import { type TDate } from "timeago.js";
import { useTimeAgo } from "@notesfriend/common";

type TimeAgoProps = {
  datetime: TDate;
  locale?: "short" | "en_short";
  live?: boolean;
  interval?: number;
};
function TimeAgo({
  datetime,
  live,
  locale,
  interval,
  sx,
  ...restProps
}: TimeAgoProps & TextProps) {
  const timeRef = useRef<HTMLDivElement>(null);

  const time = useTimeAgo(datetime, { live, locale, interval });

  return (
    <Text
      {...restProps}
      ref={timeRef}
      sx={{
        fontFamily: "body",
        ...sx,
        color: (sx && (sx as any)["color"]) || "inherit"
      }}
      as="time"
      data-test-id="time"
    >
      {time}
    </Text>
  );
}

export default React.memo(TimeAgo);
