import { ThemeUIStyleObject } from "@theme-ui/core";

type FlexDirection = "row" | "column";
export type FlexVariants<T extends FlexDirection> = T extends "row"
  ? {
      rowCenter: ThemeUIStyleObject;
      rowFill: ThemeUIStyleObject;
      rowCenterFill: ThemeUIStyleObject;
    }
  : {
      columnCenter: ThemeUIStyleObject;
      columnFill: ThemeUIStyleObject;
      columnCenterFill: ThemeUIStyleObject;
    };

export function createFlexVariants<T extends FlexDirection>(
  direction: T
): FlexVariants<T> {
  const variants = {
    Center: createCenterVariant(direction),
    Fill: createFillVariant(direction),
    CenterFill: createCenterFillVariant(direction)
  };
  return Object.fromEntries(
    Object.entries(variants).map(([key, value]) => {
      return [`${direction}${key}`, value];
    })
  ) as FlexVariants<T>;
}

function createCenterVariant(direction: FlexDirection): ThemeUIStyleObject {
  return {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: direction
  };
}

function createFillVariant(direction: FlexDirection): ThemeUIStyleObject {
  return {
    flex: "1 1 auto",
    flexDirection: direction
  };
}

function createCenterFillVariant(direction: FlexDirection): ThemeUIStyleObject {
  return {
    variant: `variants.${direction}Center`,
    flex: "1 1 auto",
    flexDirection: direction
  };
}
