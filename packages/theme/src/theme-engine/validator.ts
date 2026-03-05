import {
  ALPHA_COLORS,
  COLORS,
  Colors,
  DEPRECATED_COLORS,
  ThemeDefinition,
  Variants
} from "./types.js";

const RequiredKeys = [
  "version",
  "id",
  "name",
  "license",
  "authors.0.name",
  "description",
  "colorScheme",
  "compatibilityVersion",
  ...Variants.map((variant) =>
    COLORS.map((colorName) => `scopes.base.${variant}.${colorName}`)
  ).flat()
];

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const HEX_COLOR_REGEX_ALPHA =
  /^#(?:(?:[\da-fA-F]{3}){1,2}|(?:[\da-fA-F]{4}){1,2})$/;
const ID_REGEX = /^[a-z0-9_-]+$/;

export function validateTheme(json: Partial<ThemeDefinition>): {
  error: string | undefined;
} {
  const flattenedTheme = flatten(json);
  const missingKeys = [];
  for (const key of RequiredKeys) {
    if (!Object.keys(flattenedTheme).includes(key)) {
      missingKeys.push(key);
    }
  }
  if (missingKeys.length > 0) {
    return {
      error: `Invalid theme. ${missingKeys.join(
        ","
      )} are missing from the theme.`
    };
  }

  if (!json.id || !ID_REGEX.test(json.id)) {
    return {
      error: `Invalid theme. ID of theme must contain only alphanumeric characters, - & _.`
    };
  }

  const invalidColors = [];
  for (const key in flattenedTheme) {
    if (!key.startsWith("scopes")) continue;
    const keyPart = key.split(".").pop() as keyof Colors | undefined;
    if (
      !keyPart ||
      (!COLORS.includes(keyPart) && !DEPRECATED_COLORS.includes(keyPart))
    )
      return {
        error: `Invalid theme. Found unknown key: ${key}.`
      };

    const value = flattenedTheme[key];
    const isAlpha = ALPHA_COLORS.includes(keyPart);
    const isHexColor = HEX_COLOR_REGEX.test(value);
    const isAlphaHexColor = HEX_COLOR_REGEX_ALPHA.test(value);

    if (
      ((!isAlpha && !isHexColor) || (isAlpha && !isAlphaHexColor)) &&
      !isHexColor
    ) {
      invalidColors.push(key);
    }
  }

  if (invalidColors.length > 0) {
    return {
      error: `Invalid theme. ${invalidColors.join(", ")} have invalid values.`
    };
  }

  return {
    error: undefined
  };
}

export function isThemeDefinition(
  json: Partial<ThemeDefinition>
): json is ThemeDefinition {
  return !validateTheme(json).error;
}

function flatten(object: Record<string, any>) {
  const flattenedObject: Record<string, any> = {};

  for (const innerObj in object) {
    if (typeof object[innerObj] === "object") {
      if (typeof object[innerObj] === "function") continue;

      const newObject = flatten(object[innerObj]);
      for (const key in newObject) {
        flattenedObject[innerObj + "." + key] = newObject[key];
      }
    } else {
      if (typeof object[innerObj] === "function") continue;
      flattenedObject[innerObj] = object[innerObj];
    }
  }
  return flattenedObject;
}
