import { ThemeUICSSObject } from "@theme-ui/core";

export type MenuItemComponentProps = {
  onClick?: (e?: Event) => void;
};

export type MenuItemTypes = "button" | "separator" | "popup" | "lazy-loader";
export type BaseMenuItem<TType extends MenuItemTypes> = {
  type: TType;
  key: string;
  isHidden?: boolean;
  multiSelect?: boolean;
};

export type MenuSeperatorItem = BaseMenuItem<"separator">;

export type MenuPopupItem = BaseMenuItem<"popup"> & {
  component: (props: MenuItemComponentProps) => JSX.Element;
};

export type LazyMenuItemsLoader = BaseMenuItem<"lazy-loader"> & {
  loader?: React.ReactNode;
  items: () => Promise<MenuItem[]>;
};

export type MenuButtonItem = BaseMenuItem<"button"> & {
  onClick?: () => void;
  title: string;
  icon?: string;
  tooltip?: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  modifier?: string;
  menu?: { title?: string; items: MenuItem[] };
  premium?: boolean;
  variant?: "dangerous" | "normal";

  styles?: {
    title?: ThemeUICSSObject;
    icon?: ThemeUICSSObject;
  };
};

export type MenuItem =
  | MenuButtonItem
  | MenuSeperatorItem
  | MenuPopupItem
  | LazyMenuItemsLoader;
