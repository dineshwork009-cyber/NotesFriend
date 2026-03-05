import { File } from "./types.js";
import { IFileStorage } from "./interfaces.js";

export default class FileStreamSource {
  private index = 0;

  constructor(
    private readonly storage: IFileStorage,
    private readonly file: File,
    private readonly chunks: string[]
  ) {}

  start() {}

  async pull(controller: ReadableStreamDefaultController<Uint8Array>) {
    const data = await this.readChunk(this.index++);

    if (data) controller.enqueue(data);

    const isFinalChunk = this.index === this.chunks.length;
    if (isFinalChunk || !data) controller.close();
  }

  private readChunk(index: number) {
    if (index > this.chunks.length) return;
    return this.storage.readChunk(this.chunks[index]);
  }
}
