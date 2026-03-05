import {
  TransformStream,
  ReadableStream,
  WritableStream
} from "node:stream/web";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.TransformStream = TransformStream;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.ReadableStream = ReadableStream;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.WritableStream = WritableStream;
