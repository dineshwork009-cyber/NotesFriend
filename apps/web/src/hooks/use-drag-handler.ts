import { useCallback, useRef } from "react";

export function useDragHandler(id: string) {
  const isDraggingOver = useRef(false);
  const bounds = useRef<DOMRect>();

  const isDragLeaving = useCallback((e: React.DragEvent) => {
    if (
      !isDraggingOver.current ||
      !bounds.current ||
      (e.clientX >= bounds.current.x &&
        e.clientX <= bounds.current.right &&
        e.clientY >= bounds.current.y &&
        e.clientY <= bounds.current.bottom)
    )
      return false;

    isDraggingOver.current = false;
    bounds.current = undefined;
    return true;
  }, []);

  const isDragEntering = useCallback(
    (e: React.DragEvent) => {
      if (
        isDraggingOver.current ||
        !(e.target instanceof HTMLElement) ||
        (e.target.id !== id && !e.target.closest(`#${id}`))
      )
        return false;
      isDraggingOver.current = true;
      bounds.current = e.target.closest(`#${id}`)!.getBoundingClientRect();
      return true;
    },
    [id]
  );

  return { isDragEntering, isDragLeaving };
}
