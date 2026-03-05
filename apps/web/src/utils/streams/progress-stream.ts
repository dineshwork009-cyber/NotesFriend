export class ProgressStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(report: (totalRead: number, done?: boolean) => void) {
    let totalRead = 0;
    super({
      start() {},
      transform(chunk, controller) {
        controller.enqueue(chunk);
        report((totalRead += chunk.length));
      },
      flush() {
        report(totalRead, true);
      }
    });
  }
}
