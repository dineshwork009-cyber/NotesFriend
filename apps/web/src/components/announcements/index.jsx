import { Flex, Text } from "@theme-ui/components";
import { Cross } from "../icons";
import AnnouncementBody from "./body";
import { useStore as useAnnouncementStore } from "../../stores/announcement-store";
import Notice from "../notice";

import { alpha } from "@theme-ui/color";
import { strings } from "@notesfriend/intl";

function Announcements() {
  const announcements = useAnnouncementStore(
    (store) => store.inlineAnnouncements
  );
  const dismiss = useAnnouncementStore((store) => store.dismiss);
  const announcement = announcements[0];

  if (!announcement) return null;
  return (
    <Flex
      mx={1}
      mb={2}
      py={2}
      bg="var(--background-secondary)"
      sx={{
        borderRadius: "default",
        position: "relative",
        flexDirection: "column"
      }}
    >
      <Text
        p="2px"
        sx={{
          bg: alpha("red", 0.2),
          position: "absolute",
          right: 2,
          top: 2,
          borderRadius: 50,
          cursor: "pointer",
          alignSelf: "end"
        }}
        title={strings.dismissAnnouncement()}
        onClick={() => {
          dismiss(announcement.id);
        }}
      >
        <Cross size={16} color="red" />
      </Text>
      <AnnouncementBody components={announcement.body} type="inline" />
    </Flex>
  );
}

export default Announcements;
