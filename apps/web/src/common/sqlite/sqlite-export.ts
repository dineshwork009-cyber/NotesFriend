import * as VFS from "./VFS";

export class DatabaseSource {
  isDone;

  #vfs;
  #path;
  #fileId = Math.floor(Math.random() * 0x100000000);
  #iOffset = 0;
  #bytesRemaining = 0;

  #onDone: (() => Promise<unknown> | unknown)[] = [];
  #resolve!: (value: unknown) => void;
  #reject!: (reason?: unknown) => void;

  constructor(vfs: VFS.Base, path: string) {
    this.#vfs = vfs;
    this.#path = path;
    this.isDone = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    }).finally(async () => {
      while (this.#onDone.length) {
        await this.#onDone.pop()?.();
      }
    });
  }

  async start(controller: ReadableStreamDefaultController) {
    try {
      // Open the file for reading.
      const flags = VFS.SQLITE_OPEN_MAIN_DB | VFS.SQLITE_OPEN_READONLY;
      await check(
        this.#vfs.xOpen(this.#path, this.#fileId, flags, {
          setInt32() {}
        } as unknown as DataView)
      );
      this.#onDone.push(() => this.#vfs.xClose(this.#fileId));
      await check(this.#vfs.xLock(this.#fileId, VFS.SQLITE_LOCK_SHARED));
      this.#onDone.push(() =>
        this.#vfs.xUnlock(this.#fileId, VFS.SQLITE_LOCK_NONE)
      );

      // Get the file size.
      const fileSize = new DataView(new ArrayBuffer(8));
      await check(this.#vfs.xFileSize(this.#fileId, fileSize));
      this.#bytesRemaining = Number(fileSize.getBigUint64(0, true));
    } catch (e) {
      controller.error(e);
      this.#reject(e);
    }
  }

  async pull(controller: ReadableStreamDefaultController) {
    try {
      const buffer = new Uint8Array(Math.min(this.#bytesRemaining, 65536));
      await check(this.#vfs.xRead(this.#fileId, buffer, this.#iOffset));
      console.log("reading", buffer);
      controller.enqueue(buffer);

      this.#iOffset += buffer.byteLength;
      this.#bytesRemaining -= buffer.byteLength;
      if (this.#bytesRemaining === 0) {
        controller.close();
        this.#resolve(undefined);
      }
    } catch (e) {
      controller.error(e);
      this.#reject(e);
    }
  }

  cancel(reason?: any) {
    this.#reject(new Error(reason));
  }
}

async function check(code: Promise<number> | number) {
  if ((await code) !== VFS.SQLITE_OK) {
    throw new Error(`Error code: ${await code}`);
  }
}
