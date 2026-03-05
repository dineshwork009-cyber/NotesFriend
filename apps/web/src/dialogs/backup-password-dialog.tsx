import { useState } from "react";
import Field from "../components/field";
import Dialog from "../components/dialog";
import { Box, Button, Text } from "@theme-ui/components";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";

export type BackupPasswordDialogProps = BaseDialogProps<boolean> & {
  validate: (outputs: {
    password?: string;
    key?: string;
  }) => boolean | Promise<boolean>;
};

export const BackupPasswordDialog = DialogManager.register(
  function BackupPasswordDialog(props: BackupPasswordDialogProps) {
    const { onClose, validate } = props;

    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [isEncryptionKey, setIsEncryptionKey] = useState(false);

    return (
      <Dialog
        isOpen={true}
        testId="password-dialog"
        title={strings.encryptedBackup()}
        description={strings.encryptedBackupDesc()}
        onClose={() => onClose(false)}
        positiveButton={{
          form: "backupPasswordForm",
          type: "submit",
          loading: isLoading,
          disabled: isLoading,
          text: strings.restore()
        }}
        negativeButton={{
          text: strings.cancel(),
          onClick: () => onClose(false)
        }}
      >
        <Box
          id="backupPasswordForm"
          as="form"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);

            try {
              setIsLoading(true);
              setError(undefined);

              const key = formData.get("key") as string;
              const password = formData.get("password") as string;
              if (!key && !password) return;

              if (await validate({ key, password })) {
                onClose(true);
              } else {
                setError("Wrong password.");
              }
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isEncryptionKey ? (
            <Field
              required
              autoFocus
              data-test-id="encryption-key"
              label={strings.encryptionKey()}
              type="password"
              id="key"
              name="key"
            />
          ) : (
            <Field
              required
              autoFocus
              data-test-id="password"
              label={strings.password()}
              type="password"
              autoComplete="current-password"
              id="password"
              name="password"
            />
          )}
        </Box>
        <Button variant="anchor" onClick={() => setIsEncryptionKey((s) => !s)}>
          {strings.useEncryptionKey()}
        </Button>

        {error && (
          <Text as="div" mt={1} variant={"error"}>
            {error}
          </Text>
        )}
      </Dialog>
    );
  }
);
