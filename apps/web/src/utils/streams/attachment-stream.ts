import { getFileNameWithExtension, Attachment } from "@notesfriend/core";
import { db } from "../../common/db";
import { showToast } from "../toast";
import { makeUniqueFilename } from "./utils";
import { ZipFile } from "./zip-stream";
import { logger } from "../logger";
import { decryptFile } from "../../interfaces/fs";

export const METADATA_FILENAME = "metadata.json";
const GROUP_ID = "all-attachments";
export class AttachmentStream extends ReadableStream<ZipFile> {
  constructor(
    ids: string[],
    resolve: (id: string) => Promise<Attachment | undefined> | undefined,
    signal?: AbortSignal,
    onProgress?: (current: number) => void
  ) {
    if (signal)
      signal.onabort = async () => {
        await db.fs().cancel(GROUP_ID);
      };
    super({
      async start(controller) {
        const counters: Record<string, number> = {};
        let index = 0;
        for (const id of ids) {
          if (signal?.aborted) {
            controller.close();
            return;
          }

          onProgress && onProgress(index++);
          const attachment = await resolve(id);
          if (!attachment) return;
          try {
            if (
              !(await db
                .fs()
                .downloadFile(GROUP_ID, attachment.hash, attachment.chunkSize))
            )
              return;

            const key = await db.attachments.decryptKey(attachment.key);
            if (!key) return;

            const file = await decryptFile(attachment.hash, {
              key,
              iv: attachment.iv,
              name: attachment.filename,
              type: attachment.mimeType,
              isUploaded: !!attachment.dateUploaded
            });

            if (file) {
              const filePath: string =
                attachment.filename === attachment.hash
                  ? await getFileNameWithExtension(
                      attachment.hash,
                      attachment.mimeType
                    )
                  : attachment.filename;
              controller.enqueue({
                path: makeUniqueFilename(filePath, counters),
                data: new Uint8Array(await file.arrayBuffer())
              });
            } else {
              throw new Error(
                `Failed to decrypt file (hash: ${attachment.hash}, filename: ${attachment.filename}).`
              );
            }
          } catch (e) {
            logger.error(e, "Failed to download attachment");
            showToast(
              "error",
              `Failed to download attachment: ${(e as Error).message} (hash: ${
                attachment.hash
              }, filename: ${attachment.filename})`
            );
          }
        }
        controller.close();
      }
    });
  }
}
