import { useState, useEffect } from "react";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const currentLocation = () => {
  if (typeof document === "undefined") return "/";
  const location = window.location.hash.replace(/^#/, "") || "/";
  let end: number | undefined = location.indexOf("?");
  if (end <= -1) end = undefined;
  return location.substring(0, end);
};

const currentQuery = () => {
  if (typeof document === "undefined") return {};
  const location = window.location.hash.replace(/^#/, "") || "/";
  return Object.fromEntries(
    new URLSearchParams(location.substring(location.indexOf("?"))).entries()
  );
};

type HashLocation = { location: string; update: boolean };
export function useHashLocation() {
  const [loc, setLoc] = useState<HashLocation>({
    location: currentLocation(),
    update: true
  });
  const [queryParams, setQueryParams] = useState(currentQuery());

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = (e: HashChangeEvent) => {
      const event = e as HashChangeEvent & { notify: boolean };

      const update = event.notify === undefined ? true : event.notify;
      setLoc({
        location: currentLocation(),
        update
      });
      setQueryParams(currentQuery());
    };

    // subscribe to hash changes
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return [loc, queryParams] as const;
}

type HashNavigateOptions = {
  replace?: boolean;
  notify?: boolean;
  addNonce?: boolean;
};

let lastNonce = 0;
export function hashNavigate(path: string, options: HashNavigateOptions = {}) {
  const { replace = false, notify = true, addNonce = false } = options;
  let url: string = path;
  if (addNonce) url += `/${++lastNonce}`;

  if (replace) window.history.replaceState({ replace }, "", `#${url}`);
  else window.history.pushState({ replace }, "", `#${url}`);

  const event = new HashChangeEvent("hashchange");
  (event as any).notify = notify;
  dispatchEvent(event);
}
