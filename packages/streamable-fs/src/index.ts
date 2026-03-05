import FileHandle from "./filehandle.js";
import { IFileStorage, IStreamableFS } from "./interfaces.js";
import { File } from "./types.js";
import { chunkPrefix } from "./utils.js";

export class StreamableFS implements IStreamableFS {
  /**
   * @param db name of the indexeddb database
   */
  constructor(private readonly storage: IFileStorage) {}

  async createFile(
    filename: string,
    size: number,
    type: string,
    options?: { overwrite?: boolean }
  ): Promise<FileHandle> {
    const exists = await this.exists(filename);
    if (!options?.overwrite && exists) throw new Error("File already exists.");
    else if (options?.overwrite && exists) await this.deleteFile(filename);

    const file: File = {
      filename,
      size,
      type
    };
    await this.storage.setMetadata(filename, file);
    return new FileHandle(this.storage, file, []);
  }

  async readFile(filename: string): Promise<FileHandle | undefined> {
    const file = await this.storage.getMetadata(filename);
    if (!file) return undefined;
    const chunks = (await this.storage.listChunks(chunkPrefix(filename))).sort(
      (a, b) => a.localeCompare(b, undefined, { numeric: true })
    );
    return new FileHandle(this.storage, file, chunks);
  }

  async exists(filename: string): Promise<boolean> {
    const file = await this.storage.getMetadata(filename);
    return !!file;
  }

  async list(): Promise<string[]> {
    return this.storage.list();
  }

  async deleteFile(filename: string): Promise<boolean> {
    const handle = await this.readFile(filename);
    if (!handle) return true;
    await handle.delete();
    return true;
  }

  async moveFile(source: FileHandle, dest: FileHandle) {
    await source.readable.pipeTo(dest.writeable);
    await source.delete();
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }
}

export type { IFileStorage, File, FileHandle };
