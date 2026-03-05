import Note from "../note";
import Tag from "../tag";
import TrashItem from "../trash-item";
import { db } from "../../common/db";
import Reminder from "../reminder";
import { Context } from "./types";
import { getSortValue } from "@notesfriend/core";
import { GroupingKey, Item } from "@notesfriend/core";
import { isNoteResolvedData } from "@notesfriend/common";
import { Attachment } from "../attachment";
import { Notebook } from "../notebook";
import SearchResult from "../search-result";

const SINGLE_LINE_HEIGHT = 1.4;
const DEFAULT_LINE_HEIGHT =
  (document.getElementById("p")?.clientHeight || 16) - 1;
export const DEFAULT_ITEM_HEIGHT = SINGLE_LINE_HEIGHT * 4 * DEFAULT_LINE_HEIGHT;

type ListItemWrapperProps = {
  group?: GroupingKey;
  item: Item;
  data?: unknown;
  context?: Context;
  compact?: boolean;
};

export function ListItemWrapper(props: ListItemWrapperProps) {
  const { group, compact, context, item, data } = props;

  switch (item.type) {
    case "searchResult":
      return <SearchResult item={item} />;
    case "note": {
      return (
        <Note
          compact={compact}
          item={item}
          date={getDate(item, group)}
          context={context}
          {...(isNoteResolvedData(data) ? data : {})}
        />
      );
    }
    case "trash":
      return <TrashItem item={item} date={getDate(item, group)} />;
    case "notebook":
      return (
        <Notebook
          item={item}
          totalNotes={typeof data === "number" ? data : 0}
        />
      );
    case "reminder":
      return <Reminder item={item} compact={compact} />;
    case "tag":
      return (
        <Tag item={item} totalNotes={typeof data === "number" ? data : 0} />
      );
    case "attachment":
      return <Attachment item={item} compact={compact} />;
    default:
      return null;
  }
}

type PlaceholderData = {
  padding: [number, number, number, number];
  lines: { height: number; width: "random" | string | number }[];
  gap?: number;
};
const COMPACT_PLACEHOLDER_ITEM_DATA: PlaceholderData = {
  padding: [6, 5, 6, 5],
  lines: [{ height: 16, width: `random` }]
};
const FULL_PLACEHOLDER_ITEM_DATA: PlaceholderData = {
  padding: [10, 5, 10, 5],
  gap: 5,
  lines: [
    {
      height: 16,
      width: "50%"
    },
    {
      height: 12,
      width: "100%"
    },
    {
      height: 12,
      width: "70%"
    },
    {
      height: 10,
      width: 30
    }
  ]
};
export function getListItemDefaultHeight(
  group: GroupingKey | undefined,
  compact: boolean | undefined
) {
  const data = getListItemPlaceholderData(group, compact);
  let height = data.padding[0] + data.padding[2];
  if (data.gap) height += data.gap * data.lines.length - 1;
  data.lines.forEach((line) => (height += line.height));
  return height;
}
export function getListItemPlaceholderData(
  group: GroupingKey | undefined,
  compact: boolean | undefined
): PlaceholderData {
  switch (group) {
    case "home":
    case "favorites":
    case "notes":
    case "notebooks":
    case "trash":
    case "reminders":
      if (compact) return COMPACT_PLACEHOLDER_ITEM_DATA;
      return FULL_PLACEHOLDER_ITEM_DATA;
    case "tags":
    default:
      return COMPACT_PLACEHOLDER_ITEM_DATA;
  }
}

function getDate(item: Item, groupType?: GroupingKey): number {
  return (
    getSortValue(
      groupType
        ? db.settings.getGroupOptions(groupType)
        : {
            sortBy: "dateEdited",
            sortDirection: "desc"
          },
      item
    ) || 0
  );
}
