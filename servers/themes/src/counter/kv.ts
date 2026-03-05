import { Mutex } from "async-mutex";
import { Cloudflare } from "cloudflare";

type WorkersKVRESTConfig = {
  cfAccountId: string;
  cfAuthToken: string;
  namespaceId: string;
};
export class KVCounter {
  private readonly client: Cloudflare;
  private readonly mutex: Mutex;
  private installs: Record<string, string[] | null> = {};
  constructor(private readonly config: WorkersKVRESTConfig) {
    this.mutex = new Mutex();
    this.client = new Cloudflare({
      apiToken: this.config.cfAuthToken
    });
  }

  async increment(key: string, uid: string) {
    return await this.mutex.runExclusive(async () => {
      const existing = this.installs[key] || [];
      const installsSet = Array.from(new Set([...existing, uid]));
      await write(this.client, this.config, key, installsSet);
      this.installs[key] = installsSet;
      return installsSet.length;
    });
  }

  async counts(keys: string[]): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    const installs = await readMulti(this.client, this.config, keys);
    for (const [key, value] of Object.entries(installs)) {
      result[key] = value?.length ?? 0;
    }
    this.installs = installs;
    return result;
  }
}

async function readMulti(
  client: Cloudflare,
  config: WorkersKVRESTConfig,
  keys: string[]
): Promise<Record<string, string[] | null>> {
  try {
    const response = await client.kv.namespaces.bulkGet(config.namespaceId, {
      account_id: config.cfAccountId,
      keys,
      type: "json",
      withMetadata: false
    });
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(response?.values || {})) {
      result[key] = value;
    }
    return result;
  } catch (e) {
    console.error(e);
    return {};
  }
}

function write<T>(
  client: Cloudflare,
  config: WorkersKVRESTConfig,
  key: string,
  data: T
) {
  return client.kv.namespaces.values.update(config.namespaceId, key, {
    account_id: config.cfAccountId,
    value: JSON.stringify(data)
  });
}
