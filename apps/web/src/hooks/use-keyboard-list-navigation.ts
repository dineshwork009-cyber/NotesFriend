import { useCallback, useRef } from "react";
import { keydownHandler } from "../common/key-handler";

enum DIRECTION {
  UP = -1,
  SAME = 0,
  DOWN = 1
}

type UseKeyboardListNavigationOptions = {
  length: number;
  reset: () => void;
  select: (index: number, toggleable?: boolean) => void;
  deselect: (index: number) => void;
  bulkSelect: (indices: number[]) => void;
  focusItemAt: (index: number) => void;
  open?: (index: number) => void;
  skip?: (index: number) => boolean;
};

export function useKeyboardListNavigation(
  options: UseKeyboardListNavigationOptions
) {
  const {
    length,
    skip,
    open,
    deselect,
    reset,
    select,
    bulkSelect,
    focusItemAt
  } = options;
  const cursor = useRef(-1);
  const anchor = useRef(-1);
  // const { reset, select, deselect } = useSelection();

  const direction = useCallback(() => {
    return cursor.current === anchor.current
      ? DIRECTION.SAME
      : cursor.current > anchor.current
      ? DIRECTION.DOWN
      : DIRECTION.UP;
  }, []);

  const resetSelection = useCallback(() => {
    reset();
    anchor.current = -1;
  }, [reset]);

  const openActiveItem = useCallback(() => {
    if (!open) return false;
    resetSelection();
    open(cursor.current);
    select(cursor.current);
    return true;
  }, [open, resetSelection, select]);

  const onMouseUp = useCallback(
    (e: MouseEvent, itemIndex: number) => {
      if (e.button !== 0) return;
      if (e.ctrlKey || e.metaKey) {
        select(itemIndex, true);
      } else if (e.shiftKey) {
        const startIndex =
          itemIndex > cursor.current ? cursor.current : itemIndex;
        const endIndex =
          itemIndex > cursor.current ? itemIndex : cursor.current;
        const indices = [];
        for (let i = startIndex; i <= endIndex; ++i) {
          if (skip && skip(i)) continue;
          indices.push(i);
        }
        bulkSelect(indices);
        focusItemAt(itemIndex);
      } else {
        resetSelection();
        select(itemIndex);
      }
      cursor.current = itemIndex;
    },
    [select, resetSelection, bulkSelect, skip, focusItemAt]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const max = length - 1;

      keydownHandler({
        Space: openActiveItem,
        Enter: openActiveItem,
        ArrowUp: () => {
          resetSelection();

          let nextIndex = moveUpCyclic(cursor.current, max);
          while (skip && skip(nextIndex))
            nextIndex = moveUpCyclic(nextIndex, max);
          focusItemAt(nextIndex);
          cursor.current = nextIndex;
          return true;
        },
        ArrowDown: () => {
          resetSelection();

          let nextIndex = moveDownCyclic(cursor.current, max);
          while (skip && skip(nextIndex))
            nextIndex = moveDownCyclic(nextIndex, max);
          focusItemAt(nextIndex);
          cursor.current = nextIndex;
          return true;
        },
        "Mod-a": () => {
          resetSelection();
          bulkSelect(new Array(length).fill(0).map((_, i) => i));
          return true;
        },
        "Shift-ArrowUp": () => {
          if (anchor.current === -1) {
            anchor.current = cursor.current;
            select(anchor.current);
          }

          if (direction() === DIRECTION.DOWN) {
            deselect(cursor.current);
          }

          let nextIndex = moveUp(cursor.current);
          if (skip && skip(nextIndex)) nextIndex = moveUp(nextIndex);
          if (nextIndex === cursor.current) return false;

          focusItemAt(nextIndex);
          cursor.current = nextIndex;
          if (direction() === DIRECTION.UP) {
            select(nextIndex);
          }
          e.preventDefault();
          return false;
        },
        "Shift-ArrowDown": () => {
          if (anchor.current === -1) {
            anchor.current = cursor.current;
            select(anchor.current);
          }

          if (direction() === DIRECTION.UP) {
            deselect(cursor.current);
          }

          let nextIndex = moveDown(cursor.current, max);
          if (skip && skip(nextIndex)) nextIndex = moveDown(nextIndex, max);
          if (nextIndex === cursor.current) return false;

          focusItemAt(nextIndex);
          cursor.current = nextIndex;
          if (direction() === DIRECTION.DOWN) {
            select(nextIndex);
          }
          e.preventDefault();
          return false;
        },
        Escape: () => {
          resetSelection();
          return true;
        }
      })(e);
    },
    [
      length,
      openActiveItem,
      resetSelection,
      skip,
      focusItemAt,
      bulkSelect,
      direction,
      select,
      deselect
    ]
  );

  return { onMouseUp, onKeyDown };
}

const moveDownCyclic = (i: number, max: number) => (i < max ? ++i : 0);
const moveUpCyclic = (i: number, max: number) => (i > 0 ? --i : max);
const moveDown = (i: number, max: number) => (i < max ? ++i : max);
const moveUp = (i: number) => (i > 0 ? --i : 0);
