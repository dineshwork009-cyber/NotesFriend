import sodium from "libsodium-wrappers-sumo";
import { base64_variants, type ISodium } from "./types";

export class Sodium implements ISodium {
  async initialize() {
    await sodium.ready;
  }

  get crypto_generichash() {
    return sodium.crypto_generichash;
  }

  get crypto_pwhash() {
    return sodium.crypto_pwhash;
  }

  get crypto_pwhash_ALG_ARGON2ID13() {
    return sodium.crypto_pwhash_ALG_ARGON2ID13;
  }
  get crypto_pwhash_SALTBYTES() {
    return sodium.crypto_pwhash_SALTBYTES;
  }
  get crypto_pwhash_ALG_ARGON2I13() {
    return sodium.crypto_pwhash_ALG_ARGON2I13;
  }
  get crypto_pwhash_ALG_DEFAULT() {
    return sodium.crypto_pwhash_ALG_DEFAULT;
  }
  get crypto_pwhash_OPSLIMIT_INTERACTIVE() {
    return sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
  }
  get crypto_pwhash_OPSLIMIT_MODERATE() {
    return sodium.crypto_pwhash_OPSLIMIT_MODERATE;
  }
  get crypto_pwhash_OPSLIMIT_SENSITIVE() {
    return sodium.crypto_pwhash_OPSLIMIT_SENSITIVE;
  }
  get crypto_pwhash_MEMLIMIT_INTERACTIVE() {
    return sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;
  }
  get crypto_pwhash_MEMLIMIT_MODERATE() {
    return sodium.crypto_pwhash_MEMLIMIT_MODERATE;
  }
  get crypto_pwhash_MEMLIMIT_SENSITIVE() {
    return sodium.crypto_pwhash_MEMLIMIT_SENSITIVE;
  }

  // helpers
  from_base64(input: string, variant?: base64_variants) {
    return sodium.from_base64(
      input,
      variant ? convertVariant(variant) : undefined
    );
  }
  to_base64(input: string | Uint8Array, variant?: base64_variants): string {
    return sodium.to_base64(
      input,
      variant ? convertVariant(variant) : undefined
    );
  }
  get randombytes_buf() {
    return sodium.randombytes_buf;
  }
  get to_string() {
    return sodium.to_string;
  }
  get from_hex() {
    return sodium.from_hex;
  }

  // aead
  get crypto_aead_xchacha20poly1305_ietf_KEYBYTES() {
    return sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES;
  }
  get crypto_aead_xchacha20poly1305_ietf_encrypt() {
    return sodium.crypto_aead_xchacha20poly1305_ietf_encrypt;
  }
  get crypto_aead_xchacha20poly1305_ietf_decrypt() {
    return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt;
  }
  get crypto_secretstream_xchacha20poly1305_init_push() {
    return sodium.crypto_secretstream_xchacha20poly1305_init_push;
  }
  get crypto_secretstream_xchacha20poly1305_push() {
    return sodium.crypto_secretstream_xchacha20poly1305_push;
  }
  get crypto_secretstream_xchacha20poly1305_init_pull() {
    return sodium.crypto_secretstream_xchacha20poly1305_init_pull;
  }
  get crypto_secretstream_xchacha20poly1305_pull() {
    return sodium.crypto_secretstream_xchacha20poly1305_pull;
  }
  get crypto_aead_xchacha20poly1305_ietf_NPUBBYTES() {
    return sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;
  }
  get crypto_secretstream_xchacha20poly1305_TAG_FINAL() {
    return sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL;
  }
  get crypto_secretstream_xchacha20poly1305_TAG_MESSAGE() {
    return sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
  }
  get crypto_box_keypair() {
    return sodium.crypto_box_keypair;
  }
  get crypto_box_seal_open() {
    return sodium.crypto_box_seal_open;
  }
}

function convertVariant(variant: base64_variants): sodium.base64_variants {
  switch (variant) {
    case base64_variants.ORIGINAL:
      return sodium.base64_variants.ORIGINAL;
    case base64_variants.ORIGINAL_NO_PADDING:
      return sodium.base64_variants.ORIGINAL_NO_PADDING;
    case base64_variants.URLSAFE:
      return sodium.base64_variants.URLSAFE;
    case base64_variants.URLSAFE_NO_PADDING:
      return sodium.base64_variants.URLSAFE_NO_PADDING;
  }
}
export { base64_variants, ISodium };
export {
  type StateAddress,
  type Uint8ArrayOutputFormat,
  type StringOutputFormat,
  type MessageTag,
  type StringMessageTag
} from "libsodium-wrappers-sumo";
