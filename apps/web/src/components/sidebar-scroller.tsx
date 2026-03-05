import { forwardRef } from "react";
import { ScrollerProps } from "react-virtuoso";
import ScrollContainer from "./scroll-container";

export const SidebarScroller = forwardRef<HTMLDivElement, ScrollerProps>(
  function CustomScroller(props, ref) {
    return (
      <ScrollContainer
        {...props}
        trackStyle={() => ({
          width: 3
        })}
        thumbStyle={() => ({ width: 3 })}
        suppressScrollX={true}
        forwardedRef={(sRef) => {
          if (typeof ref === "function") ref(sRef);
          else if (ref) ref.current = sRef;
        }}
      />
    );
  }
);
