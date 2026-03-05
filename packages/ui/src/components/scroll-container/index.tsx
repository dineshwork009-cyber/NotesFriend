import { PropsWithChildren } from "react";
import { MacScrollbar, MacScrollbarProps } from "mac-scrollbar";

type ScrollContainerProps = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
} & MacScrollbarProps;

export function ScrollContainer({
  id,
  children,
  style,
  className,
  ...restProps
}: PropsWithChildren<ScrollContainerProps>) {
  return (
    <MacScrollbar
      {...restProps}
      id={id}
      className={className}
      style={style}
      minThumbSize={40}
    >
      {children}
    </MacScrollbar>
  );
}
