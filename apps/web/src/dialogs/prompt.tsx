import { useRef } from "react";
import Field from "../components/field";
import Dialog from "../components/dialog";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";

export type PromptDialogProps = BaseDialogProps<undefined | string> & {
  title: string;
  description?: string;
  defaultValue?: string;
};

export const PromptDialog = DialogManager.register(function PromptDialog(
  props: PromptDialogProps
) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog
      isOpen={true}
      title={props.title}
      description={props.description}
      onClose={() => props.onClose(props.defaultValue)}
      positiveButton={{
        text: strings.submit(),
        onClick: () => props.onClose(inputRef.current?.value || "")
      }}
      negativeButton={{
        text: strings.cancel(),
        onClick: () => props.onClose(props.defaultValue)
      }}
    >
      <Field
        inputRef={inputRef}
        defaultValue={props.defaultValue}
        autoFocus
        onKeyUp={(e) => {
          if (e.key == "Enter") props.onClose(inputRef.current?.value || "");
        }}
      />
    </Dialog>
  );
});
