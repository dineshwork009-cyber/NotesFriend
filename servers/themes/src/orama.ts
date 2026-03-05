import { Orama, SearchParams, create, search, update } from "@orama/orama";
import { CompiledThemeDefinition, ThemeMetadata } from "./sync";
import { ThemeQuerySchema } from "./schemas";

export let ThemesDatabase: Orama | null = null;
export async function initializeDatabase(): Promise<Orama> {
  ThemesDatabase = await create({
    schema: {
      id: "string",
      name: "string",
      authors: { name: "string", email: "string", url: "string" },
      colorScheme: "string",
      compatibilityVersion: "number",
      description: "string",
      tags: "string[]",
      totalInstalls: "number"
    },
    id: "notesfriend-themes"
  });
  return ThemesDatabase;
}

export async function findTheme(
  id: string,
  compatibilityVersion: number
): Promise<CompiledThemeDefinition | undefined> {
  if (!ThemesDatabase) await initializeDatabase();

  const results = await search(ThemesDatabase!, {
    term: "",
    where: {
      id,
      compatibilityVersion: { eq: compatibilityVersion }
    }
  });
  return results.hits[0].document as CompiledThemeDefinition;
}

export async function updateTotalInstalls(
  theme: CompiledThemeDefinition,
  totalInstalls: number
) {
  if (!ThemesDatabase) await initializeDatabase();
  await update(ThemesDatabase!, theme.id, { ...theme, totalInstalls });
}

export async function getThemes(query: (typeof ThemeQuerySchema)["_type"]) {
  if (!ThemesDatabase) await initializeDatabase();

  const from = query.cursor;
  const count = query.limit;

  const searchParams: SearchParams = {
    sortBy: {
      property: "totalInstalls",
      order: "DESC"
    },
    where: {
      compatibilityVersion: {
        eq: query.compatibilityVersion
      }
    },
    limit: query.limit,
    offset: query.cursor
  };
  for (const filter of query.filters || []) {
    switch (filter.type) {
      case "term":
        searchParams.term = filter.value;
        searchParams.properties = [
          "name",
          "authors.name",
          "description",
          "tags",
          "id"
        ];
        break;
      case "colorScheme":
        searchParams.where = {
          ...searchParams.where,
          colorScheme: filter.value
        };
        break;
    }
  }
  const results = await search(ThemesDatabase!, searchParams);
  const themes: ThemeMetadata[] = [];
  for (const hit of results.hits) {
    const theme = hit.document as CompiledThemeDefinition;
    themes.push({
      ...theme,
      scopes: undefined,
      codeBlockCSS: undefined
    } as ThemeMetadata);
  }

  return {
    themes,
    nextCursor: (from + count < results.count ? from + count : undefined) as
      | number
      | undefined
  };
}
