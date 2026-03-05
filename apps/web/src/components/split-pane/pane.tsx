import { PropsWithChildren } from "react";
import { HTMLElementProps, IPaneConfigs } from "./types";

export default function Pane({
  paneRef,
  children,
  style,
  className,
  role,
  title,
  id
}: PropsWithChildren<HTMLElementProps & IPaneConfigs>) {
  return (
    <div
      id={id}
      ref={paneRef}
      role={role}
      title={title}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
