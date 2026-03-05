import WorkersKVREST from "@sagi.io/workers-kv";
import { readSecrets } from "../secrets";

const env = readSecrets([
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_AUTH_TOKEN",
  "CLOUDFLARE_KV_NAMESPACE_ID"
]);
const cfAccountId = env.CLOUDFLARE_ACCOUNT_ID;
const cfAuthToken = env.CLOUDFLARE_AUTH_TOKEN;
const namespaceId = env.CLOUDFLARE_KV_NAMESPACE_ID;

if (!cfAccountId || !cfAuthToken || !namespaceId)
  throw new Error(
    "Please provide Cloudflare credentials to use Cloudflare KV API for storing data."
  );

const WorkersKV = new WorkersKVREST({
  cfAccountId,
  cfAuthToken,
  namespaceId
});

export async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const response = await WorkersKV.readKey({
      key
    });
    if (typeof response === "object" && !response.success) {
      // console.error("failed:", response.errors);
      return fallback;
    }
    return (
      JSON.parse(typeof response === "string" ? response : response.result) ||
      fallback
    );
  } catch (e) {
    // console.error(e);
    return fallback;
  }
}

export async function write<T>(key: string, data: T) {
  await WorkersKV.writeKey({
    key,
    value: JSON.stringify(data)
  });
}

read("spam-cache", "default").then(console.log);
