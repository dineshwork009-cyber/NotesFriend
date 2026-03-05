import makeMatcher from "wouter/matcher";
import useHashLocation from "./use-hash-location";
import { Params, HashRoutes } from "../navigation/types";
import { useEffect } from "react";

export default function useHashRoutes<T extends string>(routes: HashRoutes<T>) {
  const [{ location, update }] = useHashLocation();

  useEffect(() => {
    if (!update) return;

    const matcher = makeMatcher();
    for (const key in routes) {
      const [match, params] = matcher(key, location);
      if (match) {
        routes[key]((params as Params<typeof key>) || {});
      }
    }
  }, [update, location, routes]);
}
