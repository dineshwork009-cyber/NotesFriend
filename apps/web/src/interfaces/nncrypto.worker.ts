import { NNCrypto, Chunk, SerializedKey } from "@notesfriend/crypto";
import { expose, transfer } from "comlink";

class NNCryptoWorker extends NNCrypto {
  override async createDecryptionStream(
    key: SerializedKey,
    iv: string
  ): Promise<TransformStream<Uint8Array, Uint8Array>> {
    const stream = await super.createDecryptionStream(key, iv);
    return transfer(stream, [stream]);
  }

  override async createEncryptionStream(
    key: SerializedKey
  ): Promise<{ iv: string; stream: TransformStream<Chunk, Uint8Array> }> {
    const result = await super.createEncryptionStream(key);
    return transfer(result, [result.stream]);
  }
}

expose(new NNCryptoWorker());
