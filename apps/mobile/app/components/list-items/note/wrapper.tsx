import { BaseTrashItem, Color, Note, Reminder } from "@notesfriend/core";
import React from "react";
import NoteItem from ".";
import { notesfriend } from "../../../../e2e/test.ids";
import { db } from "../../../common/database";
import { DDS } from "../../../services/device-detection";
import {
  eSendEvent,
  hideSheet,
  presentSheet
} from "../../../services/event-manager";
import { eOnLoadNote, eShowMergeDialog } from "../../../utils/events";
import { fluidTabsRef } from "../../../utils/global-refs";

import { NotebooksWithDateEdited, TagsWithDateEdited } from "@notesfriend/common";
import NotePreview from "../../note-history/preview";
import SelectionWrapper, { selectItem } from "../selection-wrapper";
import { RouteParams } from "../../../stores/use-navigation-store";

export const openNote = async (
  item: Note,
  isTrash?: boolean,
  isSheet?: boolean
) => {
  let note: Note = item;
  if (isSheet) hideSheet();

  if (!isTrash) {
    note = (await db.notes.note(item.id)) as Note;
  }

  if (selectItem(item)) return;

  if (note.conflicted) {
    eSendEvent(eShowMergeDialog, note);
    return;
  }

  if (isTrash) {
    if (!note.contentId) return;

    const content = await db.content.get(note.contentId as string);
    presentSheet({
      component: <NotePreview note={item} content={content} />
    });
  } else {
    eSendEvent(eOnLoadNote, {
      item: note
    });
    if (!DDS.isTab) {
      fluidTabsRef.current?.goToPage("editor");
    }
  }
};

type NoteWrapperProps = {
  item: Note | BaseTrashItem<Note>;
  index: number;
  tags?: TagsWithDateEdited;
  notebooks?: NotebooksWithDateEdited;
  color?: Color;
  reminder?: Reminder;
  attachmentsCount: number;
  date: number;
  isRenderedInActionSheet: boolean;
  locked?: boolean;
  renderedInRoute?: keyof RouteParams;
};

export const NoteWrapper = React.memo<
  React.FunctionComponent<NoteWrapperProps>
>(
  function NoteWrapper({
    item,
    index,
    isRenderedInActionSheet,
    ...restProps
  }: NoteWrapperProps) {
    const isTrash = item.type === "trash";

    return (
      <SelectionWrapper
        testID={notesfriend.ids.note.get(index)}
        onPress={() => openNote(item as Note, isTrash, isRenderedInActionSheet)}
        isSheet={isRenderedInActionSheet}
        item={item}
        index={index}
        color={restProps.color?.colorCode}
      >
        <NoteItem {...restProps} item={item} index={index} isTrash={isTrash} />
      </SelectionWrapper>
    );
  },
  (prev, next) => {
    if (prev.date !== next.date) {
      return false;
    }

    if (
      prev.tags?.dateEdited !== next.tags?.dateEdited ||
      prev.tags?.items?.length !== next.tags?.items?.length
    )
      return false;

    if (
      prev.notebooks?.dateEdited !== next.notebooks?.dateEdited ||
      prev.notebooks?.items?.length !== next.notebooks?.items?.length
    )
      return false;

    if (prev.color !== next.color) return false;
    if (prev.reminder?.id !== next.reminder?.id) return false;
    if (prev.attachmentsCount !== next.attachmentsCount) return false;
    if (prev.item?.dateModified !== next.item?.dateModified) {
      return false;
    }
    if (prev.item?.id !== next.item?.id) return false;

    return true;
  }
);
