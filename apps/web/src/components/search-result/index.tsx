import { HighlightedResult } from "@notesfriend/core";
import { Button, Flex, Text } from "@theme-ui/components";
import React, { Fragment, useState } from "react";
import { useEditorStore } from "../../stores/editor-store";
import { useStore as useNoteStore } from "../../stores/note-store";
import ListItem from "../list-item";
import { ChevronDown, ChevronRight } from "../icons";
import { noteMenuItems } from "../note";
import { db } from "../../common/db";
import { MenuItem } from "@notesfriend/ui";

type SearchResultProps = {
  item: HighlightedResult;
};

function SearchResult(props: SearchResultProps) {
  const { item } = props;

  const isOpened = useEditorStore((store) => store.isNoteOpen(item.id));
  const isExpandable = item.content.length > 0;
  const [isExpanded, setIsExpanded] = useState(isExpandable);
  const isCompact = useNoteStore((store) => store.viewMode === "compact");

  if (!item.title.length && !item.content.length) return null;
  return (
    <Flex sx={{ flexDirection: "column" }}>
      <ListItem
        isFocused={isOpened}
        item={item}
        menuItems={menuItems}
        onClick={() => {
          useEditorStore.getState().openSession(item.id, {
            rawContent: item.rawContent,
            force: true
          });
        }}
        onMiddleClick={() => {
          useEditorStore.getState().openSession(item.id, {
            openInNewTab: true,
            rawContent: item.rawContent
          });
        }}
        title={
          <Flex sx={{ alignItems: "center", gap: "small" }}>
            {isExpandable && !isCompact ? (
              <Button
                variant="secondary"
                sx={{
                  bg: "transparent",
                  p: 0,
                  borderRadius: 100,
                  flexShrink: 0
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((s) => !s);
                }}
              >
                {isExpanded ? (
                  <ChevronDown
                    size={14}
                    color={isOpened ? "icon-selected" : "icon"}
                  />
                ) : (
                  <ChevronRight
                    size={14}
                    color={isOpened ? "icon-selected" : "icon"}
                  />
                )}
              </Button>
            ) : null}
            <Flex
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1
              }}
            >
              <Text
                data-test-id={`title`}
                variant={"body"}
                color={isOpened ? "paragraph-selected" : "paragraph"}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: isCompact ? "bold" : "bolder",
                  display: "block",
                  ".match": {
                    bg: "accent-secondary",
                    color: "accentForeground-secondary"
                  }
                }}
              >
                {item.title.map((match) => (
                  <Fragment key={match.id}>
                    <span>{match.prefix}</span>
                    <span className="match">{match.match}</span>
                    {match.suffix ? <span>{match.suffix}</span> : null}
                  </Fragment>
                ))}
              </Text>

              <Text variant="subBody">
                {item.content?.reduce(
                  (count, next) => next.length + count,
                  0
                ) || 0}
              </Text>
            </Flex>
          </Flex>
        }
        sx={{
          my: "small",
          borderRadius: "default",
          mx: 1
        }}
      />
      {isExpanded && !isCompact
        ? item.content.map((match, index) => (
            <ListItem
              key={`${item.id}${index}`}
              isFocused={false}
              item={item}
              menuItems={menuItems}
              onClick={() => {
                useEditorStore.getState().openSession(item.id, {
                  rawContent: item.rawContent,
                  force: true,
                  activeSearchResultId: match[0].id
                });
              }}
              onMiddleClick={() => {
                useEditorStore.getState().openSession(item.id, {
                  openInNewTab: true,
                  rawContent: item.rawContent,
                  activeSearchResultId: match[0].id
                });
              }}
              title={
                <Text
                  data-test-id={`title`}
                  variant={"body"}
                  color={isOpened ? "paragraph-selected" : "paragraph"}
                  sx={{
                    whiteSpace: "pre-wrap",
                    display: "block",
                    ".match": {
                      bg: "accent-secondary",
                      color: "accentForeground-secondary"
                    }
                  }}
                >
                  {match.map((match) => (
                    <Fragment key={match.id}>
                      <span>{match.prefix}</span>
                      <span className="match">{match.match}</span>
                      {match.suffix ? <span>{match.suffix}</span> : null}
                    </Fragment>
                  ))}
                </Text>
              }
              sx={{
                px: 1,
                borderBottom: "1px solid var(--border)",
                mx: 1
              }}
            />
          ))
        : null}
    </Flex>
  );
}

export default React.memo(SearchResult);

async function menuItems(
  item: HighlightedResult,
  ids?: string[]
): Promise<MenuItem[]> {
  const note = await db.notes.note(item.id);
  if (!note) return [];

  const colors = await db.relations
    .to({ type: "note", id: item.id }, "color")
    .resolve();
  return noteMenuItems(note, ids, {
    locked: !!(
      await db
        .sql()
        .selectFrom("content")
        .where("noteId", "in", [note.id])
        .select(["noteId", "locked"])
        .executeTakeFirst()
    )?.locked,
    color: colors[0]
  });
}
