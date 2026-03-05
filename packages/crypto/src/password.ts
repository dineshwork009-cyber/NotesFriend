import { ISodium } from "@notesfriend/sodium";

export default class Password {
  static hash(sodium: ISodium, password: string, salt: string): string {
    const saltBytes = sodium.crypto_generichash(
      sodium.crypto_pwhash_SALTBYTES,
      salt
    );
    const hash = sodium.crypto_pwhash(
      32,
      password,
      saltBytes,
      3, // operations limit
      1024 * 1024 * 64, // memory limit (8MB)
      sodium.crypto_pwhash_ALG_ARGON2ID13,
      "base64"
    );
    return hash;
  }
}
