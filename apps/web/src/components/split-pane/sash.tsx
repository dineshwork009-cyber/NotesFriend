import { useRef, useState } from "react";
import { classNames, sashClassName } from "./base";
import { ISashProps } from "./types";

export default function Sash({
  className,
  render,
  onDragStart,
  onDragging,
  onDragEnd,
  sashRef,
  ...others
}: ISashProps) {
  const timeout = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [draging, setDrag] = useState(false);

  const handleMouseMove = function (e: MouseEvent) {
    onDragging(e as any);
  };

  const handleMouseUp = function (e: MouseEvent) {
    setDrag(false);
    onDragEnd(e as any);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={sashRef}
      role="Resizer"
      className={classNames(sashClassName, className)}
      onMouseEnter={() => {
        timeout.current = setTimeout(() => {
          setActive(true);
        }, 150) as unknown as number;
      }}
      onMouseLeave={() => {
        if (timeout.current) {
          setActive(false);
          clearTimeout(timeout.current);
        }
      }}
      onMouseDown={(e) => {
        setDrag(true);
        onDragStart(e);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }}
      {...others}
    >
      {render(draging || active)}
    </div>
  );
}
