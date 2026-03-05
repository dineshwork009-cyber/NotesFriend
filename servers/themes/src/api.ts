import { z } from "zod";
import { InstallsCounter } from "./constants";
import { findTheme, getThemes, updateTotalInstalls } from "./orama";
import { syncThemes } from "./sync";
import { publicProcedure, router } from "./trpc";
import { THEME_COMPATIBILITY_VERSION } from "@notesfriend/theme";
import { ThemeQuerySchema } from "./schemas";

export const ThemesAPI = router({
  themes: publicProcedure.input(ThemeQuerySchema).query(async ({ input }) => {
    return getThemes(input);
  }),
  installTheme: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string().optional(),
        compatibilityVersion: z.number().default(THEME_COMPATIBILITY_VERSION)
      })
    )
    .query(async ({ input: { compatibilityVersion, id, userId } }) => {
      const theme = await findTheme(id, compatibilityVersion);
      if (!theme) return;

      if (userId) {
        updateTotalInstalls(
          theme,
          await InstallsCounter.increment(theme.id, userId)
        );
      }
      return theme;
    }),
  updateTheme: publicProcedure
    .input(
      z.object({
        id: z.string(),
        version: z.number(),
        compatibilityVersion: z.number()
      })
    )
    .query(async ({ input: { id, version, compatibilityVersion } }) => {
      const theme = await findTheme(id, compatibilityVersion);
      if (theme && theme.version !== version) return theme;
    }),
  sync: publicProcedure.query(() => {
    syncThemes();
    return true;
  }),
  health: publicProcedure.query(() => {
    return "Healthy";
  })
});
