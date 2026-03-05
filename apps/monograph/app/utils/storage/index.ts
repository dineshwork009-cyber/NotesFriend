const cache: Record<
  string,
  {
    ttl: number;
    value: any;
    cachedAt: number;
  }
> = {};
export async function read<T>(key: string, fallback: T) {
  const cached = cache[key];
  if (cached && cached.ttl > Date.now() - cached.cachedAt) {
    return cached.value as T;
  }
  const value = (await provider).read<T>(key, fallback);
  cache[key] = {
    ttl: 60 * 60 * 1000,
    value,
    cachedAt: Date.now()
  };
  return value;
}

export async function write<T>(key: string, data: T) {
  if (cache[key]) {
    cache[key].value = data;
    cache[key].cachedAt = Date.now();
  }
  return (await provider).write<T>(key, data);
}

const provider = selectProvider();
async function selectProvider() {
  return await import("./kv").catch(() => import("./fs"));
}
