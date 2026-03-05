import { IFileStorage } from "@notesfriend/core";
import { checkAttachment, downloadFile } from "./download";
import {
  bulkExists,
  clearCache,
  clearFileStorage,
  deleteCacheFileByName,
  deleteCacheFileByPath,
  deleteFile,
  exists,
  getCacheSize,
  hashBase64,
  readEncrypted,
  writeEncryptedBase64
} from "./io";
import { uploadFile } from "./upload";
import {
  cancelable,
  checkAndCreateDir,
  getUploadedFileSize,
  requestPermission
} from "./utils";

export default {
  checkAttachment,
  clearCache,
  deleteCacheFileByName,
  deleteCacheFileByPath,
  getCacheSize,
  requestPermission,
  checkAndCreateDir,
  getUploadedFileSize
};

export const FileStorage: IFileStorage = {
  readEncrypted,
  writeEncryptedBase64,
  hashBase64,
  uploadFile: cancelable(uploadFile),
  downloadFile: cancelable(downloadFile),
  deleteFile,
  exists,
  clearFileStorage,
  getUploadedFileSize,
  bulkExists
};
