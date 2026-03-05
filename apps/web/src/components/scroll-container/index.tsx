import React, { PropsWithChildren, useLayoutEffect } from "react";
import { MacScrollbar, MacScrollbarProps } from "mac-scrollbar";
import "mac-scrollbar/dist/mac-scrollbar.css";

export type ScrollContainerProps = {
  style?: React.CSSProperties;
  forwardedRef?: (ref: HTMLDivElement | null) => void;
} & MacScrollbarProps;

const ScrollContainer = ({
  children,
  forwardedRef,
  style,
  ...props
}: PropsWithChildren<ScrollContainerProps>) => {
  return (
    <MacScrollbar
      suppressScrollX
      minThumbSize={40}
      {...props}
      ref={(div) => {
        forwardedRef && forwardedRef(div as HTMLDivElement);
      }}
      style={{
        position: "relative",
        height: "100%",
        ...style
      }}
    >
      {children}
    </MacScrollbar>
  );
};
export default ScrollContainer;

type FlexScrollContainerProps = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  scrollRef?: React.Ref<HTMLElement>;
} & MacScrollbarProps;

export function FlexScrollContainer({
  id,
  children,
  style,
  className,
  scrollRef,
  ...restProps
}: PropsWithChildren<FlexScrollContainerProps>) {
  return (
    <MacScrollbar
      {...restProps}
      ref={scrollRef}
      id={id}
      className={className}
      style={style}
      minThumbSize={40}
    >
      {children}
    </MacScrollbar>
  );
}
