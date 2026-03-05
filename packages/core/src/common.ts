import EventManager from "./utils/event-manager.js";

export const EV = new EventManager();

export const SYNC_CHECK_IDS = {
  autoSync: "autoSync",
  sync: "sync"
};

export type SyncStatusEvent = keyof typeof SYNC_CHECK_IDS;

export async function checkSyncStatus(
  eventManager: EventManager,
  type: string
) {
  const results = await eventManager.publishWithResult<{
    type: string;
    result: boolean;
  }>(EVENTS.syncCheckStatus, type);
  if (typeof results === "boolean") return results;
  else if (typeof results === "undefined") return true;
  return results.some((r) => r.type === type && r.result === true);
}

export type SyncProgressEvent = {
  type: "upload" | "download";
  current: number;
};

export function sendSyncProgressEvent(
  eventManager: EventManager,
  type: string,
  current: number
) {
  eventManager.publish(EVENTS.syncProgress, {
    type,
    current
  } as SyncProgressEvent);
}

export function sendMigrationProgressEvent(
  eventManager: EventManager,
  collection: string,
  total: number,
  current?: number
) {
  eventManager.publish(EVENTS.migrationProgress, {
    collection,
    total,
    current: current === undefined ? total : current
  });
}

export const CLIENT_ID = "notesfriend";

export const EVENTS = {
  userSubscriptionUpdated: "user:subscriptionUpdated",
  userEmailConfirmed: "user:emailConfirmed",
  userLoggedIn: "user:loggedIn",
  userLoggedOut: "user:loggedOut",
  userFetched: "user:fetched",
  userSignedUp: "user:signedUp",
  userSessionExpired: "user:sessionExpired",
  databaseSyncRequested: "db:syncRequested",
  syncProgress: "sync:progress",
  syncCompleted: "sync:completed",
  syncItemMerged: "sync:itemMerged",
  syncAborted: "sync:aborted",
  syncCheckStatus: "sync:checkStatus",
  databaseUpdated: "db:updated",
  databaseCollectionInitiated: "db:collectionInitiated",
  appRefreshRequested: "app:refreshRequested",
  migrationProgress: "migration:progress",
  migrationStarted: "migration:start",
  migrationFinished: "migration:finished",
  noteRemoved: "note:removed",
  tokenRefreshed: "token:refreshed",
  userUnauthorized: "user:unauthorized",
  downloadCanceled: "file:downloadCanceled",
  uploadCanceled: "file:uploadCanceled",
  fileDownload: "file:download",
  fileUpload: "file:upload",
  fileDownloaded: "file:downloaded",
  fileUploaded: "file:uploaded",
  attachmentDeleted: "attachment:deleted",
  mediaAttachmentDownloaded: "attachments:mediaDownloaded",
  vaultLocked: "vault:locked",
  vaultUnlocked: "vault:unlocked",
  systemTimeInvalid: "system:invalidTime"
};

const separators = ["-", "/", "."];
const DD = "DD";
const MM = "MM";
const YYYY = "YYYY";
export const DATE_FORMATS = [
  ...[
    [DD, MM, YYYY],
    [MM, DD, YYYY],
    [YYYY, MM, DD]
  ]
    .map((item) => separators.map((sep) => item.join(sep)))
    .flat(),
  "MMM D, YYYY"
];

export const TIME_FORMATS = ["12-hour", "24-hour"];

export const CURRENT_DATABASE_VERSION = 6.1;

export const FREE_NOTEBOOKS_LIMIT = 20;
