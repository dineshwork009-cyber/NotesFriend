import { hasRequire } from "./has-require.js";

export function randomBytes(size: number): Buffer {
  const crypto =
    globalThis.crypto || (hasRequire() ? require("node:crypto") : null);
  if (!crypto) throw new Error("Crypto is not supported on this platform.");
  if ("randomBytes" in crypto && typeof crypto.randomBytes === "function")
    return crypto.randomBytes(size);

  if (!crypto.getRandomValues)
    throw new Error(
      "Crypto.getRandomValues is not available on this platform."
    );

  const buffer = Buffer.alloc(size);
  crypto.getRandomValues(buffer);
  return buffer;
}

export function randomInt() {
  return randomBytes(4).readInt32BE();
}
