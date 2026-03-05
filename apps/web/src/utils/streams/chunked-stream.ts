import { Chunk } from "@notesfriend/crypto";

export class ChunkedStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(chunkSize: number, mode: "nocopy" | "copy") {
    let backBuffer: Uint8Array | null = null;
    super({
      start() {},
      transform(chunk, controller) {
        backBuffer = backBuffer
          ? Buffer.concat(
              [Buffer.from(backBuffer), Buffer.from(chunk)],
              backBuffer.length + chunk.length
            )
          : Buffer.from(chunk);

        if (backBuffer.length >= chunkSize) {
          let remainingBytes = backBuffer.length;
          while (remainingBytes >= chunkSize) {
            const start = backBuffer.length - remainingBytes;
            const end = start + chunkSize;

            // TODO: find a way to support sending the chunked
            // buffer to web workers without copying.
            controller.enqueue(
              mode === "copy"
                ? new Uint8Array(backBuffer.buffer.slice(start, end))
                : backBuffer.subarray(start, end)
            );
            remainingBytes -= chunkSize;
          }

          backBuffer =
            remainingBytes > 0
              ? backBuffer.subarray(backBuffer.length - remainingBytes)
              : null;
        }
      },
      flush(controller) {
        if (backBuffer) {
          const buffer =
            mode === "copy" ? new Uint8Array(backBuffer) : backBuffer;
          controller.enqueue(buffer);
        }
      }
    });
  }
}

export class IntoChunks extends TransformStream<Uint8Array, Chunk> {
  constructor(totalSize: number) {
    let size = 0;
    super({
      start() {},
      transform(chunk, controller) {
        size += chunk.length;
        controller.enqueue({ data: chunk, final: size === totalSize });
      }
    });
  }
}
