export async function lazify<T, R>(
  loader: Promise<T>,
  action: (module: T) => R | Promise<R>
): Promise<R> {
  const module = await loader;
  return await action(module);
}
