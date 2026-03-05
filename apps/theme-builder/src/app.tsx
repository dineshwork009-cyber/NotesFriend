import { useQueryParams } from "@notesfriend/web/src/navigation";
import ThemeBuilder from "./components/theme-builder";
import { useEffect, useState } from "react";
import { Loader } from "@notesfriend/web/src/components/loader";
import { Flex } from "@theme-ui/components";
import { useStore } from "@notesfriend/web/src/stores/theme-store";
import {
  loadThemeFromBase64,
  loadThemeFromPullRequest,
  loadThemeFromURL
} from "./utils/theme-loader";

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [{ from_pr, from_url, from_base64 }] = useQueryParams();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await useStore.getState().init();
        const theme = from_pr
          ? await loadThemeFromPullRequest(from_pr)
          : from_url
          ? await loadThemeFromURL(from_url)
          : from_base64
          ? loadThemeFromBase64(from_base64)
          : null;
        if (!theme) return;
        useStore.getState().setTheme(theme);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [from_pr, from_url, from_base64]);

  return (
    <Flex
      sx={{
        width: 260,
        flexShrink: 0,
        bg: "background",
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        overflowY: "scroll",
        pt: 2,
        rowGap: 2,
        borderLeft: "1px solid var(--border)",
        zIndex: 1001
      }}
    >
      {isLoading ? (
        <Loader title="Downloading theme" text="Please wait..." />
      ) : (
        <ThemeBuilder />
      )}
    </Flex>
  );
}
