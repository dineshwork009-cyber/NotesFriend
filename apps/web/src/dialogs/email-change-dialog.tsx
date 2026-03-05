import { Flex, Text } from "@theme-ui/components";
import { useCallback, useRef, useState } from "react";
import { db } from "../common/db";
import { useTimer } from "../hooks/use-timer";
import Field from "../components/field";
import { Loading } from "../components/icons";
import Dialog from "../components/dialog";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";

type EmailChangeState = {
  newEmail: string;
  password: string;
};
export type EmailChangeDialogProps = BaseDialogProps<boolean>;
export const EmailChangeDialog = DialogManager.register(
  function EmailChangeDialog(props: EmailChangeDialogProps) {
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [emailChangeState, setEmailChangeState] =
      useState<EmailChangeState>();
    const [isSending, setIsSending] = useState(false);
    const { elapsed, enabled, setEnabled } = useTimer(`email_change_code`, 60);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    const sendCode = useCallback(
      async (emailChangeState: EmailChangeState) => {
        setIsSending(true);
        try {
          await db.user.sendVerificationEmail(emailChangeState.newEmail);

          setEnabled(false);
        } catch (e) {
          const error = e as Error;
          setError(error.message);
        } finally {
          setIsSending(false);
        }
      },
      [setEnabled]
    );

    return (
      <Dialog
        isOpen={true}
        title={strings.changeEmail()}
        description={strings.changeEmailDesc()}
        onClose={() => props.onClose(false)}
        positiveButton={{
          text: strings.next(),
          disabled: isLoading,
          loading: isLoading,
          form: "changeEmailForm"
        }}
        negativeButton={{
          text: strings.cancel(),
          onClick: () => props.onClose(false)
        }}
      >
        <Flex
          id="changeEmailForm"
          as="form"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setIsLoading(true);
              setError(undefined);

              const formData = new FormData(e.target as HTMLFormElement);
              const { password, newEmail, code } = Object.fromEntries(
                formData.entries() as IterableIterator<[string, string]>
              );

              if (emailChangeState) {
                if (!code || code.length < 6) {
                  setError("Please enter a valid verification code.");
                  return;
                }

                await db.user.changeEmail(
                  emailChangeState.newEmail,
                  emailChangeState.password,
                  code
                );
                props.onClose(true);
                return;
              }

              if (!newEmail.trim() || !password.trim()) return;

              if (!password || !(await db.user.verifyPassword(password))) {
                setError("Password is not correct.");
                return;
              }

              await db.user.sendVerificationEmail(newEmail);
              setEmailChangeState({ newEmail, password });
            } catch (e) {
              if (e instanceof Error) setError(e.message);
            } finally {
              setIsLoading(false);
            }
          }}
          sx={{ flexDirection: "column" }}
        >
          {emailChangeState ? (
            <Field
              inputRef={codeRef}
              id="code"
              name="code"
              label={strings.sixDigitCode()}
              helpText={strings.enterSixDigitCode()}
              type="text"
              required
              action={{
                disabled: isSending || !enabled,
                component: (
                  <Text variant={"body"}>
                    {isSending ? (
                      <Loading size={18} />
                    ) : enabled ? (
                      strings.resendCode()
                    ) : (
                      strings.resendCode(elapsed)
                    )}
                  </Text>
                ),
                onClick: async () => {
                  await sendCode(emailChangeState);
                }
              }}
            />
          ) : (
            <>
              <Field
                inputRef={emailRef}
                id="newEmail"
                name="newEmail"
                label={strings.newEmail()}
                type="email"
                required
              />
              <Field
                inputRef={passwordRef}
                id="password"
                name="password"
                label={strings.accountPassword()}
                type="password"
                required
              />
              <Text variant="subBody" sx={{ mt: 1 }}>
                {strings.changeEmailNotice()}
              </Text>
            </>
          )}
          {error && <Text variant="error">{error}</Text>}
        </Flex>
      </Dialog>
    );
  }
);
