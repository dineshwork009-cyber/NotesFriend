import { ISodium } from "@notesfriend/sodium";
import {
  EncryptionKey,
  EncryptionKeyPair,
  SerializedKey,
  SerializedKeyPair
} from "./types.js";

export enum base64_variants {
  ORIGINAL = 1,
  ORIGINAL_NO_PADDING = 3,
  URLSAFE = 5,
  URLSAFE_NO_PADDING = 7
}

export default class KeyUtils {
  static deriveKey(
    sodium: ISodium,
    password: string,
    salt?: string
  ): EncryptionKey {
    let saltBytes: Uint8Array;
    if (!salt)
      saltBytes = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    else {
      saltBytes = sodium.from_base64(salt);
    }

    if (!saltBytes)
      throw new Error("Could not generate bytes from the given salt.");

    const key = sodium.crypto_pwhash(
      sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
      password,
      saltBytes,
      3, // operations limit
      1024 * 1024 * 8, // memory limit (8MB)
      sodium.crypto_pwhash_ALG_ARGON2I13
    );

    return {
      key,
      salt: typeof salt === "string" ? salt : sodium.to_base64(saltBytes)
    };
  }

  static deriveKeyPair(sodium: ISodium): EncryptionKeyPair {
    const keypair = sodium.crypto_box_keypair();
    return {
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey
    };
  }

  static exportKey(
    sodium: ISodium,
    password: string,
    salt?: string
  ): SerializedKey {
    const { key, salt: keySalt } = this.deriveKey(sodium, password, salt);
    return { key: sodium.to_base64(key), salt: keySalt };
  }

  static exportKeyPair(sodium: ISodium): SerializedKeyPair {
    const { publicKey, privateKey } = this.deriveKeyPair(sodium);
    return {
      publicKey: sodium.to_base64(publicKey),
      privateKey: sodium.to_base64(privateKey)
    };
  }

  /**
   * Takes in either a password or a serialized encryption key
   * and spits out a key that can be directly used for encryption/decryption.
   * @param input
   */
  static transform(sodium: ISodium, input: SerializedKey): EncryptionKey {
    if ("password" in input && !!input.password) {
      const { password, salt } = input;
      return this.deriveKey(sodium, password, salt);
    } else if ("key" in input && !!input.salt && !!input.key) {
      return { key: sodium.from_base64(input.key), salt: input.salt };
    }
    throw new Error("Invalid input.");
  }
}
