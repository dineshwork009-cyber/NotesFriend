import { useEffect, useState } from "react";
import config from "../utils/config";

export function usePersistentState<T>(key: string | undefined, def: T) {
  const defState = key ? config.get<T>(key, def) : def;
  const [value, setValue] = useState(defState);

  useEffect(() => {
    if (!key) return;
    config.set<T>(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
