import { ExportableItem } from "@notesfriend/common";
import { db } from "../../common/db";
import { ZipFile } from "./zip-stream";
import { streamingDecryptFile } from "../../interfaces/fs";

export class ExportStream extends TransformStream<
  ExportableItem | Error,
  ZipFile
> {
  progress = 0;
  constructor(
    report: (progress: {
      text: string;
      current?: number;
      total?: number;
    }) => void,
    handleError: (error: Error) => void,
    totalItems?: number
  ) {
    super({
      transform: async (item, controller) => {
        if (item instanceof Error) {
          handleError(item);
          return;
        }
        if (item.type === "attachment") {
          try {
            report({ text: `Downloading attachment: ${item.path}` });
            await db
              .fs()
              .downloadFile("exports", item.data.hash, item.data.chunkSize);
            const key = await db.attachments.decryptKey(item.data.key);
            if (!key) return;
            const stream = await streamingDecryptFile(item.data.hash, {
              key,
              iv: item.data.iv,
              name: item.data.filename,
              type: item.data.mimeType,
              isUploaded: !!item.data.dateUploaded
            });

            if (!stream) return;
            controller.enqueue({ ...item, data: stream });
            report({
              current: this.progress++,
              text: `Saving attachment: ${item.path}`
            });
          } catch (e) {
            if (e instanceof Error) {
              e.message = `Failed to export attachment: ${item.path}. ${e.message}`;
              handleError(e);
            }
          }
        } else {
          controller.enqueue(item);
          report({
            current: this.progress++,
            text: `Exporting note: ${item.path}`,
            total: totalItems
          });
        }
      }
    });
  }
}
