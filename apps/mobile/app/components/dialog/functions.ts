import { KeyboardTypeOptions } from "react-native";
import { eSendEvent } from "../../services/event-manager";
import { eCloseSimpleDialog, eOpenSimpleDialog } from "../../utils/events";
import { ButtonProps } from "../ui/button";

export type DialogInfo = {
  title?: string;
  paragraph?: string;
  positiveText: string;
  negativeText: string;
  background?: string;
  transparent?: boolean;
  statusBarTranslucent?: boolean;
  positivePress?: (...args: any[]) => Promise<any>;
  onClose?: () => void;
  positiveType?:
    | "transparent"
    | "plain"
    | "secondary"
    | "accent"
    | "inverted"
    | "shade"
    | "error"
    | "errorShade";
  icon?: string;
  paragraphColor: string;
  input: boolean;
  inputPlaceholder: string;
  defaultValue: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  context: "global" | "local" | (string & {});
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  check?: {
    info: string;
    type?: ButtonProps["type"];
    defaultValue?: boolean;
  };
  notice: {
    text: string;
    type: "alert" | "information";
  };
  disableBackdropClosing: boolean;
  component: JSX.Element | ((close?: () => void) => JSX.Element);
};

export function presentDialog(data: Partial<DialogInfo>): void {
  eSendEvent(eOpenSimpleDialog, data);
}

export function hideDialog(): void {
  eSendEvent(eCloseSimpleDialog);
}
