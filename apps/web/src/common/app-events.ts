import { EventManager } from "@notesfriend/core";

export const AppEventManager = new EventManager();
export const AppEvents = {
  UPDATE_ATTACHMENT_PROGRESS: "updateAttachmentProgress",
  UPDATE_STATUS: "updateStatus",
  REMOVE_STATUS: "removeStatus",
  fileEncrypted: "file:encrypted",

  checkingForUpdate: "checkingForUpdate",
  updateAvailable: "updateAvailable",
  updateDownloadProgress: "updateDownloadProgress",
  updateDownloadCompleted: "updateDownloadCompleted",
  updateNotAvailable: "updateNotAvailable",
  updateError: "updateError",
  themeChanged: "themeChanged",
  notificationClicked: "notificationClicked",
  createItem: "createItem",

  changeNoteTitle: "changeNoteTitle",

  revealItemInList: "list:revealItem",

  toggleSideMenu: "app:openSideMenu",
  toggleEditor: "app:toggleEditor"
};
