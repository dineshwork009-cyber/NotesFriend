const FEATURE_CHECKS = {
  opfs: false,
  cache: false,
  indexedDB: false,
  clonableCryptoKey: false,
  applePaySupported: false,
  transferableStreams: false
};

export function isTransferableStreamsSupported() {
  try {
    const readable = new ReadableStream({
      pull(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        controller.close();
      }
    });
    window.postMessage(readable, [readable]);
    FEATURE_CHECKS.transferableStreams = true;
    return true;
  } catch {
    console.log("Transferable streams not supported");
    FEATURE_CHECKS.transferableStreams = false;
    return false;
  }
}

async function isApplePaySupported() {
  try {
    FEATURE_CHECKS.applePaySupported =
      !!(await window.ApplePaySession?.canMakePayments());
  } catch {
    FEATURE_CHECKS.applePaySupported = false;
  }
}

async function isOPFSSupported() {
  const hasGetDirectory =
    "getDirectory" in window.navigator.storage &&
    typeof window.navigator.storage.getDirectory === "function";
  return (
    hasGetDirectory &&
    (await window.navigator.storage
      .getDirectory()
      .then(() => (FEATURE_CHECKS.opfs = true))
      .catch(() => (FEATURE_CHECKS.opfs = false)))
  );
}

async function isCacheSupported() {
  const hasCacheStorage =
    "CacheStorage" in window &&
    "caches" in window &&
    window.caches instanceof CacheStorage;
  return (
    hasCacheStorage &&
    (await window.caches
      .has("something")
      .then(() => (FEATURE_CHECKS.cache = true))
      .catch(() => (FEATURE_CHECKS.cache = false)))
  );
}

async function isIndexedDBSupported() {
  const hasIndexedDB = "indexedDB" in window;
  return (
    hasIndexedDB &&
    (await new Promise((resolve, reject) => {
      const request = indexedDB.open("checkIDBSupport");
      request.onsuccess = () => {
        request.result.close();
        resolve(undefined);
      };
      request.onerror = reject;
    })
      .then(() => (FEATURE_CHECKS.indexedDB = true))
      .catch(() => (FEATURE_CHECKS.indexedDB = false)))
  );
}

async function isCryptoKeyClonable() {
  if (IS_DESKTOP_APP) {
    FEATURE_CHECKS.clonableCryptoKey = true;
    return;
  }

  const key = await window.crypto.subtle.generateKey(
    { name: "AES-KW", length: 256 },
    false,
    ["wrapKey", "unwrapKey"]
  );
  try {
    structuredClone(key);
    FEATURE_CHECKS.clonableCryptoKey = true;
  } catch {
    FEATURE_CHECKS.clonableCryptoKey = false;
  }
}

export async function initializeFeatureChecks() {
  await Promise.allSettled([
    isTransferableStreamsSupported(),
    isOPFSSupported(),
    isCacheSupported(),
    isIndexedDBSupported(),
    isCryptoKeyClonable(),
    isApplePaySupported()
  ]);
}

function isFeatureSupported(key: keyof typeof FEATURE_CHECKS) {
  return FEATURE_CHECKS[key];
}

export { isFeatureSupported };
