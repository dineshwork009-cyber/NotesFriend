import { useRef } from "react";
import { MMKV } from "../common/database/mmkv";

export function useStoredRef<T>(
  key: string,
  initialValue: T
): {
  current: T;
  reset(): void;
} {
  const refKey = `storedRef:${key}`;
  const value = useRef(
    MMKV.getMap<{ current: T }>(refKey)?.current || initialValue
  );
  const frameRef = useRef(0);

  return {
    get current() {
      return value.current;
    },
    set current(next: T) {
      value.current = next;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        MMKV.setMap(refKey, {
          current: value.current
        });
      });
    },
    reset() {
      MMKV.removeItem(refKey);
    }
  };
}
