import { Cipher } from "@notesfriend/crypto";
import { StorageAccessor } from "../interfaces.js";
import { randomBytes } from "./random.js";

export type CryptoAccessor = () => Crypto;
export class Crypto {
  constructor(private readonly storage: StorageAccessor) {}
  async generateRandomKey() {
    const passwordBytes = randomBytes(124);
    const password = passwordBytes.toString("base64");
    return await this.storage().generateCryptoKey(password);
  }

  async generateCryptoKeyPair() {
    return await this.storage().generateCryptoKeyPair();
  }
}

export function isCipher(item: any): item is Cipher<"base64"> {
  return (
    item !== null &&
    typeof item === "object" &&
    "cipher" in item &&
    "iv" in item &&
    "salt" in item
  );
}
