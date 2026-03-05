import { UnionCommands } from "@tiptap/core";
import { useEffect } from "react";
import { PermissionRequestEvent } from "../types.js";

export type Claims = keyof typeof ClaimsMap;
export type PermissionHandlerOptions = {
  claims: Record<Claims, boolean>;
  onPermissionDenied: (claim: Claims, silent: boolean) => void;
};

const ClaimsMap = {
  callout: ["setCallout"] as (keyof UnionCommands)[],
  outlineList: ["toggleOutlineList"] as (keyof UnionCommands)[],
  taskList: ["toggleTaskList"] as (keyof UnionCommands)[],
  insertAttachment: ["insertAttachment"] as (keyof UnionCommands)[],
  exportTableAsCsv: ["exportTableAsCsv"] as (keyof UnionCommands)[],
  importCsvToTable: ["importCsvToTable"] as (keyof UnionCommands)[]
};

export function usePermissionHandler(options: PermissionHandlerOptions) {
  const { claims, onPermissionDenied } = options;

  useEffect(() => {
    function onPermissionRequested(ev: Event) {
      const {
        detail: { id, silent }
      } = ev as PermissionRequestEvent;

      for (const key in ClaimsMap) {
        const claim = key as Claims;
        const commands = ClaimsMap[claim];

        if (commands.indexOf(id) <= -1) continue;
        if (claims[claim]) continue;

        onPermissionDenied(claim, silent);
        ev.preventDefault();
        break;
      }
    }
    window.addEventListener("permissionrequest", onPermissionRequested);
    return () => {
      window.removeEventListener("permissionrequest", onPermissionRequested);
    };
  }, [claims, onPermissionDenied]);
}
