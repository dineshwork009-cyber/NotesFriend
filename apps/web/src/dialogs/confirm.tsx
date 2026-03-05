import { Checkbox, Flex, Label, Text } from "@theme-ui/components";
import { useRef } from "react";
import { mdToHtml } from "../utils/md";
import Dialog from "../components/dialog";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { db } from "../common/db";
import { getChangelog } from "../utils/version";
import { downloadUpdate } from "../utils/updater";
import { ErrorText } from "../components/error-text";
import { strings } from "@notesfriend/intl";
import Field from "../components/field";

type Check = { text: string; default?: boolean };
type Input = {
  title: string;
  defaultValue?: string;
  multiline?: boolean;
  helpText?: string;
  required?: boolean;
};
export type ConfirmDialogProps = BaseDialogProps<
  | false
  | {
      checks?: Record<string, boolean>;
      inputs?: Record<string, string>;
    }
> & {
  title: string;
  subtitle?: string;
  width?: number;
  positiveButtonText?: string;
  negativeButtonText?: string;
  message?: string;
  warnings?: string[];
  checks?: Record<string, Check>;
  inputs?: Record<string, Input>;
};

export const ConfirmDialog = DialogManager.register(function ConfirmDialog(
  props: ConfirmDialogProps
) {
  const {
    onClose,
    title,
    subtitle,
    width,
    negativeButtonText,
    positiveButtonText,
    message,
    warnings,
    checks,
    inputs
  } = props;
  const checkedItems = useRef<Record<string, boolean>>({} as any);
  const inputItems = useRef<Record<string, string>>({} as any);

  return (
    <Dialog
      testId="confirm-dialog"
      isOpen={true}
      title={title}
      width={width}
      description={subtitle}
      onClose={() => onClose(false)}
      onOpen={() => {
        for (const checkId in checks) {
          checkedItems.current[checkId] = checks[checkId]?.default || false;
        }
        for (const inputId in inputs) {
          inputItems.current[inputId] = inputs[inputId]?.defaultValue || "";
        }
      }}
      positiveButton={
        positiveButtonText
          ? {
              text: positiveButtonText,
              onClick: () =>
                onClose({
                  checks: checkedItems.current,
                  inputs: inputItems.current
                }),
              autoFocus: !!positiveButtonText
            }
          : undefined
      }
      negativeButton={
        negativeButtonText
          ? {
              text: negativeButtonText,
              onClick: () => onClose(false)
            }
          : undefined
      }
    >
      <Flex
        sx={{
          flexDirection: "column",
          gap: 1,
          pb: !negativeButtonText && !positiveButtonText ? 2 : 0,
          p: { m: 0 }
        }}
      >
        {message ? (
          <Text
            as="div"
            variant="body"
            dangerouslySetInnerHTML={{ __html: mdToHtml(message) }}
          />
        ) : null}
        {warnings?.map((text) => (
          <ErrorText key={text} error={text} sx={{ mt: 0 }} />
        ))}
        {inputs
          ? Object.entries(inputs).map(([id, input]) => (
              <Field
                as={input.multiline ? "textarea" : "input"}
                key={id}
                label={input.title}
                helpText={input.helpText}
                defaultValue={input.defaultValue}
                required={input.required}
                onChange={(e) => {
                  inputItems.current[id] = e.target.value;
                }}
              />
            ))
          : null}
        {checks
          ? Object.entries<Check>(checks).map(([id, check]) => (
              <Label
                key={id}
                id={id}
                variant="text.body"
                sx={{ fontWeight: "bold" }}
              >
                <Checkbox
                  name={id}
                  defaultChecked={check.default}
                  sx={{
                    mr: "small",
                    width: 18,
                    height: 18,
                    color: "accent"
                  }}
                  onChange={(e) =>
                    (checkedItems.current[id] = e.currentTarget.checked)
                  }
                />
                {check.text}
              </Label>
            ))
          : null}
      </Flex>
    </Dialog>
  );
});

export function showMultiDeleteConfirmation(length: number) {
  return ConfirmDialog.show({
    title: strings.doActions.delete.item(length),
    message: strings.moveToTrashDesc(
      db.settings.getTrashCleanupInterval() || 7
    ),
    positiveButtonText: strings.yes(),
    negativeButtonText: strings.no()
  });
}

export function showMultiPermanentDeleteConfirmation(length: number) {
  return ConfirmDialog.show({
    title: strings.doActions.permanentlyDelete.item(length),
    message: strings.irreverisibleAction(),
    positiveButtonText: strings.yes(),
    negativeButtonText: strings.no()
  });
}

export async function showLogoutConfirmation() {
  return await ConfirmDialog.show({
    title: strings.logout(),
    message: strings.logoutConfirmation(),
    positiveButtonText: strings.yes(),
    negativeButtonText: strings.no(),
    warnings: (await db.hasUnsyncedChanges())
      ? [strings.unsyncedChangesWarning()]
      : [],
    checks: {
      backup: {
        text: strings.backupDataBeforeLogout(),
        default: true
      }
    }
  });
}

export function showClearSessionsConfirmation() {
  return ConfirmDialog.show({
    title: strings.logoutAllOtherDevices(),
    message: strings.logoutAllOtherDevicesDescription(),
    positiveButtonText: strings.yes(),
    negativeButtonText: strings.no()
  });
}

export async function showUpdateAvailableNotice({
  version
}: {
  version: string;
}) {
  const changelog = await getChangelog(version);

  return showUpdateDialog({
    title: strings.newVersion(),
    subtitle: strings.newVersionAvailable(version),
    changelog,
    action: { text: strings.updateNow(), onClick: () => downloadUpdate() }
  });
}

type UpdateDialogProps = {
  title: string;
  subtitle: string;
  changelog: string;
  action: {
    text: string;
    onClick: () => void;
  };
};
async function showUpdateDialog({
  title,
  subtitle,
  changelog,
  action
}: UpdateDialogProps) {
  const result = await ConfirmDialog.show({
    title,
    subtitle,
    message: changelog,
    width: 500,
    positiveButtonText: action.text
  });
  if (result && action.onClick) action.onClick();
}
