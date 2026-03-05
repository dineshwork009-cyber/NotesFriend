import { TextInput } from "react-native";
import { Settings } from "../../stores/use-setting-store";
import { FeatureId } from "@notesfriend/common";

export type SettingSection = {
  id: string;
  type?:
    | "screen"
    | "switch"
    | "component"
    | "danger"
    | "input"
    | "input-selector"
    | "dropdown-selector";
  name?: string | ((current?: unknown) => string);
  description?: string | ((current: unknown) => string);
  icon?: string;
  property?: keyof Settings;
  sections?: SettingSection[];
  component?: string;
  modifer?: (...args: unknown[]) => void;
  getter?: (...args: unknown[]) => unknown;
  useHook?: (...args: unknown[]) => unknown;
  hidden?: (current: unknown) => boolean;
  onChange?: (property: boolean) => void;
  inputProperties?: TextInput["props"];
  options?: any[];
  minInputValue?: number;
  maxInputValue?: number;
  onVerify?: () => Promise<boolean>;
  hideHeader?: boolean;
  disabled?: (current: unknown) => boolean;
  featureId?: FeatureId;
};

export type SettingsGroup = {
  name: string;
  sections: SettingSection[];
};

export type RouteParams = {
  SettingsHome: { [name: string]: string };
  SettingsGroup: SettingSection;
};
