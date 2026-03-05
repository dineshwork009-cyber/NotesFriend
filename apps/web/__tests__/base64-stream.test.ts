import "./bootstrap";
import { test } from "vitest";
import { Base64DecoderStream } from "../src/utils/streams/base64-decoder-stream";
import { consumeReadableStream } from "../src/utils/stream";
import { createReadStream, readFileSync } from "fs";
import { Readable } from "stream";
import path from "path";

test("streamed base64 decoder should output same as non-streamed", async (t) => {
  const expected = readFileSync(
    path.join(__dirname, "..", "__e2e__", "data", "importer-data.zip"),
    "base64"
  );
  const fileStream = Readable.toWeb(
    createReadStream(
      path.join(__dirname, "..", "__e2e__", "data", "importer-data.zip")
    )
  ) as ReadableStream<Uint8Array>;

  t.expect(
    (
      await consumeReadableStream(
        fileStream.pipeThrough(new Base64DecoderStream("base64"))
      )
    ).join("")
  ).toBe(expected);
});
