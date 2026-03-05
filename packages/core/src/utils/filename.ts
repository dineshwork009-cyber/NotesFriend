export async function getFileNameWithExtension(
  filename: string,
  mime: string | undefined
): Promise<string> {
  if (!mime || mime === "application/octet-stream") return filename;

  const { default: mimeDB } = await import("mime-db");

  const { extensions } = mimeDB[mime] || {};

  if (!extensions || extensions.length === 0) return filename;

  for (const ext of extensions) {
    if (filename.endsWith(ext)) return filename;
  }

  const extension = extensions.values().next().value;
  return `${filename}.${extension}`;
}

export const PDFMimeType = "application/pdf";
export const DocumentMimeTypes = [
  PDFMimeType,
  "application/msword",
  "application/vnd.ms-word",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml",
  "application/vnd.oasis.opendocument.presentation"
];

export function isDocument(mime: string) {
  return DocumentMimeTypes.some((a) => a.startsWith(mime));
}

export const WebClipMimeType = "application/vnd.notesfriend.web-clip";
export function isWebClip(mime: string) {
  return mime === WebClipMimeType;
}

export function isImage(mime: string) {
  return mime.startsWith("image/");
}

export function isVideo(mime: string) {
  return mime.startsWith("video/");
}

export function isAudio(mime: string) {
  return mime.startsWith("audio/");
}
