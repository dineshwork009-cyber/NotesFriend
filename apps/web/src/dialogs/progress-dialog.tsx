import { useEffect, useState } from "react";
import { Box, Flex, Text } from "@theme-ui/components";
import Dialog from "../components/dialog";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";

type Progress = {
  total?: number;
  current?: number;
  text: string;
};
type ProgressDialogProps<T> = BaseDialogProps<T | Error> & {
  title: string;
  subtitle?: string;
  action: (report: (progress: Progress) => void) => T;
};
export const ProgressDialog = DialogManager.register(function ProgressDialog<T>(
  props: ProgressDialogProps<T>
) {
  const [{ current = 0, total = 1, text }, setProgress] = useState<Progress>({
    text: ""
  });

  useEffect(() => {
    (async function () {
      try {
        props.onClose(await props.action(setProgress));
      } catch (e) {
        console.error(e);
        props.onClose(e as Error);
      }
    })();
  }, [props]);

  return (
    <Dialog
      isOpen={true}
      testId="progress-dialog"
      title={props.title}
      description={props.subtitle}
      onClose={() => {}}
    >
      <Flex sx={{ flexDirection: "column" }}>
        <Text variant="body">{text}</Text>
        {current > 0 ? (
          <>
            <Text variant="subBody">
              {current} {strings.of()} {total}
            </Text>
            <Box
              sx={{
                alignSelf: "start",
                my: 1,
                bg: "accent",
                height: "2px",
                width: `${(current / total) * 100}%`
              }}
            />
          </>
        ) : (
          <Flex my={1} />
        )}
      </Flex>
    </Dialog>
  );
});
