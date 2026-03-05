import React, { PropsWithChildren } from "react";
import { MacScrollbar } from "mac-scrollbar";
import "mac-scrollbar/dist/mac-scrollbar.css";

type ScrollContainerProps = {
  style?: React.CSSProperties;
  forwardedRef?: (ref: HTMLDivElement | null) => void;
};

const ScrollContainer = ({
  children,
  forwardedRef,
  ...props
}: PropsWithChildren<ScrollContainerProps>) => {
  return (
    <MacScrollbar
      {...props}
      ref={(div) => {
        forwardedRef && forwardedRef(div as HTMLDivElement);
      }}
      style={{
        position: "relative",
        height: "100%"
      }}
      minThumbSize={40}
    >
      {children}
    </MacScrollbar>
  );
};
export default ScrollContainer;

type FlexScrollContainerProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function FlexScrollContainer({
  children,
  style,
  className
}: PropsWithChildren<FlexScrollContainerProps>) {
  return (
    <MacScrollbar className={className} style={style} minThumbSize={40}>
      {children}
    </MacScrollbar>
  );
}
