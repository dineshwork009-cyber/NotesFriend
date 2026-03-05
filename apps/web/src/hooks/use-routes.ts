import { useLocation } from "wouter";
import makeMatcher from "wouter/matcher";
import { navigate, getHomeRoute } from "../navigation";
import { Params, RouteResult, Routes } from "../navigation/types";
import { useEffect, useState } from "react";

export default function useRoutes<T extends string>(
  routes: Routes<T>,
  options?: {
    hooks?: { beforeNavigate: (location: string) => boolean };
    fallbackRoute?: string;
  }
) {
  const [location] = useLocation();
  const [result, setResult] = useState<RouteResult>();

  useEffect(() => {
    (async function () {
      const matcher = makeMatcher();

      if (
        options?.hooks?.beforeNavigate &&
        !options?.hooks?.beforeNavigate(location)
      )
        return;

      for (const key in routes) {
        const [match, params] = matcher(key, location);
        if (match) {
          const result = await routes[key](
            (params as Params<typeof key>) || {}
          );
          if (!result) break;
          setResult(result);
          return;
        }
      }

      if (!options) return;
      const { fallbackRoute } = options;
      if (fallbackRoute) {
        navigate(fallbackRoute);
      }
    })();
  }, [location]);

  return result ? ([result, location] as const) : [];
}
