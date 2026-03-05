import FileHandle from "./filehandle.js";
import { File } from "./types.js";

export interface IStreamableFS {
  createFile(
    filename: string,
    size: number,
    type: string,
    options?: { overwrite?: boolean }
  ): Promise<FileHandle>;
  readFile(filename: string): Promise<FileHandle | undefined>;
  exists(filename: string): Promise<boolean>;
  deleteFile(filename: string): Promise<boolean>;
  list(): Promise<string[]>;
  moveFile(source: FileHandle, dest: FileHandle): Promise<void>;
  clear(): Promise<void>;
}

export interface IFileStorage {
  clear(): Promise<void>;
  setMetadata(filename: string, metadata: File): Promise<void>;
  getMetadata(filename: string): Promise<File | undefined>;
  deleteMetadata(filename: string): Promise<void>;
  writeChunk(chunkName: string, data: Uint8Array): Promise<void>;
  deleteChunk(chunkName: string): Promise<void>;
  readChunk(chunkName: string): Promise<Uint8Array | undefined>;
  chunkSize(chunkName: string): Promise<number>;
  listChunks(chunkPrefix: string): Promise<string[]>;
  list(): Promise<string[]>;
}
