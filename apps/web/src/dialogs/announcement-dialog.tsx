import { Flex } from "@theme-ui/components";
import AnnouncementBody from "../components/announcements/body";
import { store as announcementStore } from "../stores/announcement-store";
import { useCallback } from "react";
import BaseDialog from "../components/dialog";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";

type AnnouncementDialogProps = BaseDialogProps<boolean> & {
  announcement: any;
};
export const AnnouncementDialog = DialogManager.register(
  function AnnouncementDialog(props: AnnouncementDialogProps) {
    const { announcement, onClose } = props;

    const dismiss = useCallback(() => {
      announcementStore.get().dismiss(announcement.id);
      onClose(true);
    }, [announcement, onClose]);

    return (
      <BaseDialog isOpen onClose={() => onClose(false)} width={"30%"}>
        <Flex
          bg="background"
          sx={{
            position: "relative",
            flexDirection: "column"
          }}
        >
          <AnnouncementBody
            dismiss={dismiss}
            components={announcement.body}
            type="dialog"
          />
        </Flex>
      </BaseDialog>
    );
  }
);
