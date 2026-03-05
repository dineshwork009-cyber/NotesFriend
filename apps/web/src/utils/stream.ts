import { toAsyncIterator } from "@notesnook-importer/core/dist/src/utils/stream";

export async function consumeReadableStream<T>(
  stream: ReadableStream<T>
): Promise<T[]> {
  const chunks: T[] = [];
  for await (const chunk of toAsyncIterator(stream)) {
    chunks.push(chunk);
  }
  return chunks;
}

export function fromAsyncIterator<T>(
  iterator: AsyncIterableIterator<T>
): ReadableStream<T> {
  return new ReadableStream<T>({
    start() {},
    async pull(controller) {
      const result = await iterator.next();
      if (result.done) controller.close();
      else if (result.value) controller.enqueue(result.value);
    },
    async cancel(reason) {
      if (iterator.throw) await iterator.throw(reason);
      else throw new Error(reason);
    }
  });
}
