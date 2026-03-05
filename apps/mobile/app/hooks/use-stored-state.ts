import { useRef, useState } from "react";
import { MMKV } from "../common/database/mmkv";

export function useStoredValue<T>(
  key: string,
  initialValue: T
): { value: T; reset(): void } {
  const refKey = `storedState:${key}`;
  const [value, setValue] = useState<T>(
    MMKV.getMap<{ value: T }>(refKey)?.value || initialValue
  );
  const frameRef = useRef(0);

  return {
    get value() {
      return value;
    },
    set value(next: T) {
      setValue(next);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        MMKV.setMap(refKey, {
          value: next
        });
      });
    },
    reset() {
      MMKV.removeItem(refKey);
      setValue(initialValue);
    }
  };
}

export function resetStoredState(forKey: string, value?: any) {
  if (value) {
    MMKV.setMap(`storedState:${forKey}`, {
      value: value
    });
  } else {
    MMKV.removeItem(`storedState:${forKey}`);
  }
}
