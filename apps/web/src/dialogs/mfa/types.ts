import { AuthenticatorType } from "@notesfriend/core";
import { Icon } from "../../components/icons";

export type Authenticator = {
  type: AuthenticatorType;
  title: string;
  subtitle: string;
  icon: Icon;
  recommended?: boolean;
};

export type StepComponentProps<T extends OnNextFunction> = {
  onNext: T;
  onClose?: (result: boolean) => void;
  onError?: (error: string) => void;
};

export type StepComponent<T extends OnNextFunction> = React.FunctionComponent<
  StepComponentProps<T>
>;

export type SubmitCodeFunction = (code: string) => void;

export type OnNextFunction = (...args: never[]) => void;
