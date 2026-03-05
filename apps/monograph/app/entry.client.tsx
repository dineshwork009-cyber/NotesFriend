import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { createEmotionCache } from "./styles/createEmotionCache";

hydrateRoot(
  document.getElementById("root")!,
  <CacheProvider value={createEmotionCache()}>
    <RemixBrowser />
  </CacheProvider>
);
