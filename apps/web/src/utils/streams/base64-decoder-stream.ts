export class Base64DecoderStream extends TransformStream<Uint8Array, string> {
  constructor(encoding: "base64url" | "base64" = "base64") {
    let backBuffer: Uint8Array | null = null;
    super({
      start() {},
      transform(chunk, controller) {
        let part = backBuffer
          ? Buffer.concat(
              [Buffer.from(backBuffer), Buffer.from(chunk)],
              backBuffer.length + chunk.length
            )
          : Buffer.from(chunk.buffer);

        const remaining = part.length % 3;
        if (remaining) {
          backBuffer = new Uint8Array(remaining);
          for (let i = 0; i < remaining; ++i) {
            backBuffer[i] = part[part.length - remaining + i];
          }
          part = part.subarray(0, part.length - remaining);
        } else {
          backBuffer = null;
        }

        controller.enqueue(toBase64(part, encoding));
      },
      flush(controller) {
        if (backBuffer)
          controller.enqueue(toBase64(Buffer.from(backBuffer), encoding));
      }
    });
  }
}

function toBase64(bytes: Buffer, encoding: "base64url" | "base64") {
  const result = Buffer.isEncoding(encoding)
    ? bytes.toString(encoding)
    : bytes.toString("base64");
  return result;
}
