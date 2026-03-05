import type { ThemesRouter as ThemesRouterType } from "@notesfriend/themes-server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

export const THEME_SERVER_URL = "https://themes-api.notesfriend.com";
export const ThemesRouter = createTRPCProxyClient<ThemesRouterType>({
  links: [
    httpBatchLink({
      url: THEME_SERVER_URL
    })
  ]
});
export const ThemesTRPC = createTRPCReact<ThemesRouterType>();
