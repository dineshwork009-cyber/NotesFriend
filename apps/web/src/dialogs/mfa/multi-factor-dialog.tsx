import { useState } from "react";
import Dialog from "../../components/dialog";
import {
  AuthenticatorOnNext,
  AuthenticatorTypeOnNext,
  FallbackStep,
  fallbackSteps,
  Step,
  steps
} from "./steps";
import { Authenticator, OnNextFunction } from "./types";
import { ErrorText } from "../../components/error-text";
import { AuthenticatorType } from "@notesfriend/core";
import { BaseDialogProps, DialogManager } from "../../common/dialog-manager";
import { strings } from "@notesfriend/intl";

type MultifactorDialogProps = BaseDialogProps<boolean> & {
  primaryMethod?: AuthenticatorType;
};

export const MultifactorDialog = DialogManager.register(
  function MultifactorDialog(props: MultifactorDialogProps) {
    const { onClose, primaryMethod } = props;
    const [step, setStep] = useState<
      | Step<AuthenticatorOnNext>
      | Step<AuthenticatorTypeOnNext>
      | FallbackStep<OnNextFunction>
    >(primaryMethod ? fallbackSteps.choose(primaryMethod) : steps.choose());
    const [error, setError] = useState<string>();

    if (!step) return null;
    return (
      <Dialog
        isOpen={true}
        title={step.title}
        description={step.description}
        width={500}
        positiveButton={
          step.next
            ? {
                text: strings.continue(),
                form: "2faForm"
              }
            : null
        }
        negativeButton={
          step.cancellable
            ? {
                text: strings.cancel(),
                onClick: () => props.onClose(false)
              }
            : null
        }
      >
        {step.component && (
          <step.component
            onNext={(arg: AuthenticatorType | Authenticator) => {
              if (!step.next) return onClose(true);

              const nextStep =
                step.next !== "recoveryCodes" && primaryMethod
                  ? fallbackSteps[step.next](
                      arg as AuthenticatorType & Authenticator,
                      primaryMethod
                    )
                  : steps[step.next](arg as AuthenticatorType & Authenticator);

              setStep(nextStep);
            }}
            onError={setError}
            onClose={onClose}
          />
        )}
        <ErrorText error={error} />
      </Dialog>
    );
  }
);
