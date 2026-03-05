import ListItem from "../list-item";
import { navigate } from "../../navigation";
import { Flex, Text } from "@theme-ui/components";
import { store as appStore } from "../../stores/app-store";
import { db } from "../../common/db";
import { Edit, Shortcut, DeleteForver, Tag as TagIcon } from "../icons";
import { MenuItem } from "@notesfriend/ui";
import { Tag as TagType } from "@notesfriend/core";
import { handleDrop } from "../../common/drop-handler";
import { EditTagDialog } from "../../dialogs/item-dialog";
import { useStore as useSelectionStore } from "../../stores/selection-store";
import { useStore as useNoteStore } from "../../stores/note-store";
import { Multiselect } from "../../common/multi-select";
import { strings } from "@notesfriend/intl";
import {
  createSetDefaultHomepageMenuItem,
  withFeatureCheck
} from "../../common";
import { areFeaturesAvailable } from "@notesfriend/common";

type TagProps = { item: TagType; totalNotes: number };
function Tag(props: TagProps) {
  const { item, totalNotes } = props;
  const { id } = item;
  const currentContext = useNoteStore((store) =>
    store.context?.type === "tag" && store.context.id === id
      ? store.contextNotes
      : null
  );
  const isSelected = !!currentContext;

  return (
    <ListItem
      item={item}
      isCompact
      isFocused={isSelected}
      sx={{
        borderRadius: "default",
        mb: "small"
      }}
      title={
        <Flex
          sx={{ alignItems: "center", justifyContent: "center", gap: "small" }}
        >
          <TagIcon size={14} color={isSelected ? "icon-selected" : "icon"} />
          <Text
            data-test-id={`title`}
            variant={"body"}
            color={isSelected ? "paragraph-selected" : "paragraph"}
            sx={{
              whiteSpace: "pre",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "body",
              display: "block"
            }}
          >
            {item.title}
          </Text>
        </Flex>
      }
      footer={
        <Text mt={1} variant="subBody">
          {currentContext?.length || totalNotes}
        </Text>
      }
      onKeyPress={async (e) => {
        if (e.key === "Delete") {
          await Multiselect.deleteTags(
            useSelectionStore.getState().selectedItems
          );
        } else if (e.key === "Enter") {
          navigate(`/tags/${id}`);
        }
      }}
      menuItems={tagMenuItems}
      onClick={() => {
        navigate(`/tags/${id}`);
      }}
      onDragEnter={(e) => {
        e?.currentTarget.focus();
      }}
      onDrop={(e) => handleDrop(e.dataTransfer, item)}
    />
  );
}
export default Tag;

export const tagMenuItems: (
  tag: TagType,
  ids?: string[]
) => Promise<MenuItem[]> = async (tag, ids = []) => {
  const defaultTag = db.settings.getDefaultTag();
  const features = await areFeaturesAvailable([
    "shortcuts",
    "defaultNotebookAndTag",
    "customHomepage"
  ]);
  return [
    {
      type: "button",
      key: "edit",
      title: strings.renameTag(),
      icon: Edit.path,
      onClick: () => EditTagDialog.show(tag)
    },
    {
      type: "button",
      key: "set-as-default",
      title: strings.setAsDefault(),
      isChecked: defaultTag === tag.id,
      icon: TagIcon.path,
      premium: !features.defaultNotebookAndTag.isAllowed,
      onClick: withFeatureCheck(features.defaultNotebookAndTag, async () => {
        const defaultTag = db.settings.getDefaultTag();
        const isDefault = defaultTag === tag.id;
        await db.settings.setDefaultTag(isDefault ? undefined : tag.id);
      })
    },
    createSetDefaultHomepageMenuItem(tag.id, tag.type, features.customHomepage),
    {
      type: "button",
      key: "shortcut",
      title: db.shortcuts.exists(tag.id)
        ? strings.removeShortcut()
        : strings.addShortcut(),
      icon: Shortcut.path,
      premium: !features.shortcuts.isAllowed,
      onClick: withFeatureCheck(features.shortcuts, () =>
        appStore.addToShortcuts(tag)
      )
    },
    { key: "sep", type: "separator" },
    {
      type: "button",
      key: "delete",
      variant: "dangerous",
      title: strings.delete(),
      icon: DeleteForver.path,
      onClick: async () => {
        await Multiselect.deleteTags(ids);
      },
      multiSelect: true
    }
  ];
};
