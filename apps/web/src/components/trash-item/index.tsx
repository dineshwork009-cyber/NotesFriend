import ListItem from "../list-item";
import { Restore, DeleteForver } from "../icons";
import { Flex, Text } from "@theme-ui/components";
import TimeAgo from "../time-ago";
import { toTitleCase } from "@notesfriend/common";
import { MenuItem } from "@notesfriend/ui";
import { TrashItem as TrashItemType } from "@notesfriend/core";
import { useEditorStore } from "../../stores/editor-store";
import { useStore as useSelectionStore } from "../../stores/selection-store";
import { strings } from "@notesfriend/intl";
import { Multiselect } from "../../common/multi-select";

type TrashItemProps = { item: TrashItemType; date: number };
function TrashItem(props: TrashItemProps) {
  const { item, date } = props;
  const isOpened = useEditorStore((store) => store.isNoteOpen(item.id));

  return (
    <ListItem
      isFocused={isOpened}
      item={item}
      title={item.title}
      body={item.itemType === "note" ? item.headline : item.description}
      onKeyPress={async (e) => {
        if (e.key === "Delete") {
          await Multiselect.deleteItemsFromTrash(
            useSelectionStore.getState().selectedItems
          );
        }
      }}
      footer={
        <Flex
          mt={1}
          sx={{ fontSize: "subBody", color: "var(--paragraph-secondary)" }}
        >
          <TimeAgo live={true} datetime={date} />
          <Text as="span" mx={1}>
            •
          </Text>
          <Text sx={{ color: "accent" }}>
            {toTitleCase(item.itemType as string)}
          </Text>
        </Flex>
      }
      menuItems={trashMenuItems}
      onClick={async () => {
        if (item.itemType === "note")
          useEditorStore.getState().openSession(item);
      }}
    />
  );
}
export default TrashItem;

export const trashMenuItems: (
  item: TrashItemType,
  ids?: string[]
) => MenuItem[] = (item, ids = []) => {
  return [
    {
      type: "button",
      key: "restore",
      title: strings.restore(),
      icon: Restore.path,
      onClick: () => Multiselect.restoreItemsFromTrash(ids),
      multiSelect: true
    },
    {
      type: "button",
      key: "delete",
      title: strings.delete(),
      icon: DeleteForver.path,
      variant: "dangerous",
      onClick: () => Multiselect.deleteItemsFromTrash(ids),
      multiSelect: true
    }
  ];
};
