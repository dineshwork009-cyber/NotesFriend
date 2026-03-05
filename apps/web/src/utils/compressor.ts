import { desktop } from "../common/desktop-bridge";
import { ICompressor } from "@notesfriend/core";
import { Foras, gzip, gunzip, Memory } from "@hazae41/foras";

export class Compressor implements ICompressor {
  private inititalized = false;
  private async init() {
    if (this.inititalized) return;
    await Foras.initBundledOnce();
    this.inititalized = true;
  }
  async compress(data: string) {
    if (IS_DESKTOP_APP && desktop)
      return await desktop.compress.gzip.query({ data, level: 6 });

    await this.init();
    const bytes = new Memory(new TextEncoder().encode(data));

    const res = gzip(bytes, 6);
    const base64 = Buffer.from(res.bytes).toString("base64");
    res.free();
    return base64;
  }

  async decompress(data: string) {
    if (IS_DESKTOP_APP && desktop)
      return await desktop.compress.gunzip.query(data);

    await this.init();
    const bytes = new Memory(Buffer.from(data, "base64"));

    const res = gunzip(bytes);
    const text = Buffer.from(res.bytes).toString("utf-8");
    res.free();
    return text;
  }
}
