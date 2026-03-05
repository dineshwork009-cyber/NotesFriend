import { EVENTS } from "@notesfriend/core";
import { useCallback, useEffect, useState } from "react";
import { db } from "../common/database";

export type SyncProgressEventType = {
  type: "upload" | "download";
  total: number;
  current: number;
};

const useSyncProgress = () => {
  const [progress, setProgress] = useState<SyncProgressEventType>();

  const onProgress = useCallback(
    ({ type, current, total }: SyncProgressEventType) => {
      setProgress({ type, current, total });
    },
    []
  );

  const onSyncComplete = () => {
    setProgress(undefined);
  };
  useEffect(() => {
    db.eventManager.subscribe(EVENTS.syncProgress, onProgress);
    db.eventManager.subscribe(EVENTS.syncCompleted, onSyncComplete);
    return () => {
      db.eventManager.unsubscribe(EVENTS.syncProgress, onProgress);
      db.eventManager.unsubscribe(EVENTS.syncCompleted, onSyncComplete);
    };
  }, [onProgress]);

  return {
    progress
  };
};

export default useSyncProgress;
