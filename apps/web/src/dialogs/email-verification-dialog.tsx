import { useEffect } from "react";
import { Flex, Text } from "@theme-ui/components";
import Dialog from "../components/dialog";
import { useStore as useUserStore } from "../stores/user-store";
import { db } from "../common/db";
import { useState } from "react";
import { useSessionState } from "../hooks/use-session-state";
import Accordion from "../components/accordion";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";

let interval = 0;
type EmailVerificationDialogProps = BaseDialogProps<boolean>;
export const EmailVerificationDialog = DialogManager.register(
  function EmailVerificationDialog(props: EmailVerificationDialogProps) {
    const user = useUserStore((store) => store.user);
    const [isSending, setIsSending] = useState(false);
    const [canSendAgain, setCanSendAgain] = useSessionState(
      "canSendAgain",
      true
    );
    const [resetTimer, setResetTimer] = useSessionState("resetTimer", 60);

    useEffect(() => {
      if (!canSendAgain) {
        interval = setInterval(() => {
          setResetTimer((s) => {
            --s;
            if (s <= 0) {
              setCanSendAgain(true);
              clearInterval(interval);
              return 60;
            }
            return s;
          });
        }, 1000) as unknown as number;
      }
      return () => {
        clearInterval(interval);
      };
    }, [canSendAgain, setResetTimer, setCanSendAgain]);

    if (!user) {
      props.onClose(false);
      return null;
    }
    return (
      <Dialog
        isOpen={true}
        title={strings.confirmEmail()}
        description={strings.confirmEmailDesc()}
        onClose={() => props.onClose(false)}
        positiveButton={{
          text: canSendAgain || isSending ? "Resend" : `Resend (${resetTimer})`,
          onClick: async () => {
            setIsSending(true);
            try {
              await db.user.sendVerificationEmail();
              setCanSendAgain(false);
            } catch (e) {
              console.error(e);
            } finally {
              setIsSending(false);
            }
          },
          loading: isSending,
          disabled: isSending || !canSendAgain
        }}
        negativeButton={{
          text: strings.cancel(),
          onClick: () => props.onClose(true),
          disabled: isSending
        }}
      >
        <Flex sx={{ flexDirection: "column" }}>
          <Text
            as="span"
            variant="body"
            sx={{ borderRadius: "default", alignSelf: "stretch" }}
          >
            {strings.emailConfirmationLinkSent()}
          </Text>
          <Accordion
            isClosed
            title={strings.confirmEmailTroubleshoot()}
            sx={{
              mt: 2,
              bg: "var(--background-secondary)",
              borderRadius: "default"
            }}
          >
            <Text variant={"body"} px={1} pb={1}>
              {strings.confirmEmailTroubleshootNotice()[0]}{" "}
              <b>{strings.confirmEmailTroubleshootNotice()[1]}</b>{" "}
              {strings.confirmEmailTroubleshootNotice()[2]}.
            </Text>
          </Accordion>
        </Flex>
      </Dialog>
    );
  }
);
