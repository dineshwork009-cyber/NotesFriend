import { getFormattedHistorySessionDate } from "@notesfriend/common";
import { HistorySession } from "@notesfriend/core";
import { Flex, Text } from "@theme-ui/components";
import TimeAgo from "../time-ago";
import { Lock } from "../icons";
import { useEditorStore } from "../../stores/editor-store";
import { strings } from "@notesfriend/intl";

type SessionItemProps = {
  session: HistorySession;
  noteId: string;
};
export function SessionItem(props: SessionItemProps) {
  const { session, noteId } = props;
  const label = getFormattedHistorySessionDate(session);

  return (
    <Flex
      key={session.id}
      data-test-id={`session-item`}
      py={1}
      px={1}
      sx={{
        borderRadius: "default",
        cursor: "pointer",
        bg: "transparent",
        ":hover": {
          bg: "hover"
        },
        alignItems: "center",
        justifyContent: "space-between"
      }}
      title={strings.clickToPreview()}
      onClick={() =>
        useEditorStore.getState().openDiffSession(noteId, session.id)
      }
    >
      <Text variant={"body"} data-test-id="title">
        {label}
      </Text>
      <Flex
        sx={{
          fontSize: "subBody",
          color: "paragraph-secondary",
          flexShrink: 0
        }}
      >
        {session.locked && <Lock size={14} data-test-id="locked" />}
        <TimeAgo live datetime={session.dateModified} locale={"en_short"} />
      </Flex>
    </Flex>
  );
}
