import { Flex, Link, Text } from "@theme-ui/components";
import Field from "../components/field";
import Dialog from "../components/dialog";
import { useState } from "react";
import { writeText } from "clipboard-polyfill";
import { store as userstore } from "../stores/user-store";

import { ErrorText } from "../components/error-text";
import { Debug } from "@notesfriend/core";
import { ConfirmDialog } from "./confirm";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";
import { getDeviceInfo } from "../utils/platform";
import { getSubscriptionInfo } from "./settings/components/user-profile";

const PLACEHOLDERS = {
  title: strings.issueTitlePlaceholder(),
  body: strings.issuePlaceholder()
};

type IssueDialogProps = BaseDialogProps<boolean>;
export const IssueDialog = DialogManager.register(function IssueDialog(
  props: IssueDialogProps
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <Dialog
      isOpen={true}
      title={strings.reportAnIssue()}
      onClose={() => props.onClose(false)}
      positiveButton={{
        text: strings.submit(),
        form: "issueForm",
        loading: isSubmitting,
        disabled: isSubmitting
      }}
      negativeButton={{
        text: strings.cancel(),
        onClick: () => props.onClose(false)
      }}
    >
      <Flex
        id="issueForm"
        as="form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            setIsSubmitting(true);
            setError(undefined);

            const formData = new FormData(e.target as HTMLFormElement);
            const requestData = Object.fromEntries(
              formData.entries() as IterableIterator<[string, string]>
            );

            if (!requestData.title.trim() || !requestData.body.trim()) return;
            requestData.body = BODY_TEMPLATE(requestData.body);
            const url = await Debug.report({
              title: requestData.title,
              body: requestData.body,
              userId: userstore.get().user?.id
            });
            if (!url) throw new Error("Could not submit bug report.");

            props.onClose(true);
            await showIssueReportedDialog({ url });
          } catch (e) {
            if (e instanceof Error) setError(e.message);
          } finally {
            setIsSubmitting(false);
          }
        }}
        sx={{ flexDirection: "column" }}
      >
        <Field
          required
          label={strings.title()}
          id="title"
          name="title"
          placeholder={PLACEHOLDERS.title}
          autoFocus
        />
        <Field
          as="textarea"
          required
          variant="forms.input"
          label={strings.description()}
          id="body"
          name="body"
          placeholder={PLACEHOLDERS.body}
          sx={{ mt: 1 }}
          styles={{
            input: {
              minHeight: 150
            }
          }}
        />
        <Text
          variant="error"
          bg={"var(--background-error)"}
          mt={1}
          p={1}
          sx={{ borderRadius: "default" }}
        >
          {strings.issueNotice[0]()}{" "}
          <Link
            href="https://github.com/streetwriters/notesfriend/issues"
            title="github.com/streetwriters/notesfriend/issues"
            target="_blank"
          >
            github.com/streetwriters/notesfriend/issues
          </Link>
          {strings.issueNotice[1]()}{" "}
          <Link
            href="https://discord.gg/zQBK97EE22"
            title={strings.issueNotice[2]()}
            target="_blank"
          >
            {strings.issueNotice[2]()}
          </Link>
          /
        </Text>
        <Text variant="subBody" mt={1}>
          {getDeviceInfo([`Plan: ${getSubscriptionInfo().title}`])
            .split("\n")
            .map((t) => (
              <>
                {t}
                <br />
              </>
            ))}
        </Text>
        <ErrorText error={error} />
      </Flex>
    </Dialog>
  );
});

function showIssueReportedDialog({ url }: { url: string }) {
  return ConfirmDialog.show({
    title: strings.thankYouForReporting(),
    positiveButtonText: strings.copyLink(),
    message: strings.bugReportMessage(url)
  }).then((result) => {
    result && writeText(url);
  });
}

const BODY_TEMPLATE = (body: string) => {
  const info = `**Device information:**\n${getDeviceInfo([
    `Plan: ${getSubscriptionInfo().title}`
  ])}`;
  if (!body) return info;
  return `${body}\n\n${info}`;
};
