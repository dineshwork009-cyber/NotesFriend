import { UnionCommands, Editor as TiptapEditor } from "@tiptap/core";
import { Mutex } from "async-mutex";

export type PermissionRequestEvent = CustomEvent<{
  id: keyof UnionCommands;
  silent: boolean;
}>;

export class Editor extends TiptapEditor {
  private mutex: Mutex = new Mutex();

  /**
   * Performs editor state changes in a thread-safe manner using a mutex
   * ensuring that all changes are applied sequentially. Use this when
   * you are getting `RangeError: Applying a mismatched transaction` errors.
   */
  threadsafe(callback: (editor: TiptapEditor) => void) {
    return this.mutex.runExclusive(() => (this ? callback(this) : void 0));
  }
}

export function hasPermission(
  id: keyof UnionCommands,
  silent = false
): boolean {
  const event = new CustomEvent("permissionrequest", {
    detail: { id, silent },
    cancelable: true
  });
  return window.dispatchEvent(event);
}
