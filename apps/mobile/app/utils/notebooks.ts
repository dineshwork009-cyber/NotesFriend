import { Notebook } from "@notesfriend/core";
import { db } from "../common/database";
import { eSendEvent } from "../services/event-manager";
import { useNotebookStore } from "../stores/use-notebook-store";
import { eOnNotebookUpdated } from "./events";

export async function findRootNotebookId(id: string) {
  const relation = await db.relations
    .to(
      {
        id,
        type: "notebook"
      },
      "notebook"
    )
    .get();
  if (!relation || !relation.length) {
    return id;
  } else {
    return findRootNotebookId(relation[0].fromId);
  }
}

export async function checkParentSelected(
  id: string,
  selectedNotebooks: Notebook[]
) {
  const relation = await db.relations
    .to(
      {
        id,
        type: "notebook"
      },
      "notebook"
    )
    .get();
  if (!relation || !relation.length) {
    return false;
  } else {
    if (selectedNotebooks.findIndex((n) => n.id === relation[0].fromId) > -1)
      return true;
    return checkParentSelected(relation[0].fromId, selectedNotebooks);
  }
}

export async function getParentNotebookId(id: string) {
  const relation = await db.relations
    .to(
      {
        id,
        type: "notebook"
      },
      "notebook"
    )
    .get();

  return relation?.[0]?.fromId;
}

export async function updateNotebook(id?: string, updateParent?: boolean) {
  eSendEvent(eOnNotebookUpdated, id);
  if (updateParent && id) {
    const parent = await getParentNotebookId(id);
    if (parent) {
      eSendEvent(eOnNotebookUpdated, parent);
    } else {
      useNotebookStore.getState().refresh();
    }
  }
}
