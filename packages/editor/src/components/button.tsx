import { forwardRef, useRef, ForwardedRef } from "react";
import { useEffect } from "react";
import { Button as RebassButton, ButtonProps } from "@theme-ui/components";

const _Button = (
  props: ButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) => {
  const { sx, ...buttonProps } = props;

  const buttonRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    if (!buttonRef.current) return;

    function onMouseDown(e: MouseEvent) {
      if (globalThis.keyboardShown) {
        e.preventDefault();
      }
    }

    buttonRef.current.addEventListener("mousedown", onMouseDown, {
      passive: false,
      capture: true
    });

    return () => {
      buttonRef.current?.removeEventListener("mousedown", onMouseDown, {
        capture: true
      });
    };
  }, []);

  return (
    <RebassButton
      {...buttonProps}
      sx={{
        ...sx
      }}
      ref={(ref) => {
        buttonRef.current = ref || undefined;
        if (typeof forwardedRef === "function") forwardedRef(ref);
        else if (forwardedRef) forwardedRef.current = ref;
      }}
      onClick={props.onClick}
    />
  );
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(_Button);
