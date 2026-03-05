import { Notebook, VirtualizedGrouping } from "@notesfriend/core";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../common/database";
import { eSubscribeEvent, eUnSubscribeEvent } from "../services/event-manager";
import { eGroupOptionsUpdated, eOnNotebookUpdated } from "../utils/events";
import { useDBItem, useTotalNotes } from "./use-db-item";

export const useNotebook = (
  id?: string | number,
  items?: VirtualizedGrouping<Notebook>,
  nestedNotebooks?: boolean,
  countNotes?: boolean
) => {
  const groupOptions = db.settings.getGroupOptions("notebooks");
  const [notebooks, setNotebooks] = useState<VirtualizedGrouping<Notebook>>();
  const { totalNotes: nestedNotebookNotesCount, getTotalNotes } =
    useTotalNotes("notebook");
  const getTotalNotesRef = useRef(getTotalNotes);
  getTotalNotesRef.current = getTotalNotes;
  const onItemUpdated = React.useCallback(
    (item?: Notebook) => {
      if (!item) return;

      if (nestedNotebooks) {
        const selector = db.relations.from(
          {
            type: "notebook",
            id: item.id
          },
          "notebook"
        ).selector;
        selector.ids().then((notebookIds) => {
          getTotalNotesRef.current(notebookIds);
        });

        selector
          .sorted(db.settings.getGroupOptions("notebooks"))
          .then((notebooks) => {
            setNotebooks(notebooks);
          });
      }

      if (countNotes) {
        getTotalNotesRef.current([item?.id]);
      }
    },
    [countNotes, nestedNotebooks]
  );

  const [item, refresh] = useDBItem(id, "notebook", items, onItemUpdated);

  const itemRef = useRef(item);
  itemRef.current = item;
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    const onNotebookUpdate = (id?: string) => {
      if (typeof id === "string" && id !== id) return;
      refreshRef.current();
    };

    const onUpdate = (type: string) => {
      if (type !== "notebooks") return;
      refreshRef.current();
    };

    eSubscribeEvent(eGroupOptionsUpdated, onUpdate);
    eSubscribeEvent(eOnNotebookUpdated, onNotebookUpdate);
    return () => {
      eUnSubscribeEvent(eGroupOptionsUpdated, onUpdate);
      eUnSubscribeEvent(eOnNotebookUpdated, onNotebookUpdate);
    };
  }, [nestedNotebooks]);

  return {
    notebook: item,
    nestedNotebookNotesCount,
    nestedNotebooks: item ? notebooks : undefined,
    onUpdate: () => refresh(),
    groupOptions,
    notesCount: !item ? 0 : nestedNotebookNotesCount(item?.id)
  };
};
