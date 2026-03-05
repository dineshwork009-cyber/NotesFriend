import "./bootstrap";
import { test } from "vitest";
import { ChunkedStream } from "../src/utils/streams/chunked-stream";
import { Readable } from "stream";
import { createReadStream } from "fs";
import { consumeReadableStream } from "../src/utils/stream";
import { xxhash64 } from "hash-wasm";
import path from "path";

const CHUNK_SIZE = 512 * 1024 + 17;
test("chunked stream should create equal sized chunks", async (t) => {
  const chunks = await consumeReadableStream(
    (
      Readable.toWeb(
        createReadStream(path.join(__dirname, "data", "35a4b0a78dbb9260"))
      ) as ReadableStream<Uint8Array>
    ).pipeThrough(new ChunkedStream(CHUNK_SIZE, "copy"))
  );

  t.expect(await Promise.all(chunks.map((a) => xxhash64(a)))).toMatchObject([
    "9a3fa91d341b245d",
    "c6b5d3ec17f14a5e",
    "5163243faf462ce4",
    "63aca6b8a7f68476",
    "cd9d082fa3015bd3"
  ]);

  t.expect(
    await Promise.all(chunks.map((a) => a.byteOffset === 0))
  ).toMatchObject([true, true, true, true, true]);
});
