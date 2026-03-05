import { useState } from "react";
import Dialog from "../../components/dialog";
import { steps } from "./steps";
import { ErrorText } from "../../components/error-text";
import { AuthenticatorType } from "@notesfriend/core";
import { BaseDialogProps, DialogManager } from "../../common/dialog-manager";
import { strings } from "@notesfriend/intl";

type RecoveryCodesDialogProps = BaseDialogProps<boolean> & {
  primaryMethod: AuthenticatorType;
};

export const RecoveryCodesDialog = DialogManager.register(
  function RecoveryCodesDialog(props: RecoveryCodesDialogProps) {
    const { onClose, primaryMethod } = props;
    const [error, setError] = useState<string>();
    const step = steps.recoveryCodes(primaryMethod);

    return (
      <Dialog
        isOpen={true}
        title={step.title}
        description={step.description}
        width={500}
        positiveButton={{
          text: strings.okay(),
          onClick: () => onClose(true)
        }}
      >
        {step.component && (
          <step.component onNext={() => {}} onError={setError} />
        )}
        <ErrorText error={error} />
      </Dialog>
    );
  }
);
