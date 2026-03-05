import { Deflate, Inflate } from "./fflate-shim";
import {
  Uint8ArrayReader,
  TextReader,
  ZipWriter,
  configure
} from "@zip.js/zip.js";

configure({ Deflate, Inflate });

export type ZipFile = {
  path: string;
  data: string | Uint8Array | ReadableStream<Uint8Array>;
  mtime?: Date;
  ctime?: Date;
};

export function createZipStream(signal?: AbortSignal) {
  const written = new Set<string>();
  const ts = new TransformStream<Uint8Array, Uint8Array>();
  const writer = new ZipWriter<Uint8Array>(ts.writable, {
    zip64: true,
    signal
  });
  const entryWriter = new WritableStream<ZipFile>({
    start() {},
    async write(chunk, c) {
      // zip.js doesn't support overwriting files.
      if (written.has(chunk.path)) return;

      await writer
        .add(
          chunk.path,
          typeof chunk.data === "string"
            ? new TextReader(chunk.data)
            : chunk.data instanceof Uint8Array
            ? new Uint8ArrayReader(chunk.data)
            : chunk.data,
          {
            creationDate: chunk.ctime,
            lastModDate: chunk.mtime
          }
        )
        .catch(async (e) => {
          await ts.writable.abort(e);
          await ts.readable.cancel(e);
          c.error(e);
        });
      written.add(chunk.path);
    },
    async close() {
      await writer.close();
      await ts.writable.close();
    },
    async abort(reason) {
      await ts.writable.abort(reason);
      await ts.readable.cancel(reason);
    }
  });
  return { writable: entryWriter, readable: ts.readable };
}
