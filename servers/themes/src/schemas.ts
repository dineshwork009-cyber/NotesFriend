import { THEME_COMPATIBILITY_VERSION } from "@notesfriend/theme";
import { z } from "zod";

export const ThemeQuerySchema = z.object({
  filters: z
    .array(
      z.object({
        type: z.enum(["term", "colorScheme"]),
        value: z.string()
      })
    )
    .optional(),
  limit: z.number(),
  cursor: z.number().default(0),
  compatibilityVersion: z.number().default(THEME_COMPATIBILITY_VERSION)
});
