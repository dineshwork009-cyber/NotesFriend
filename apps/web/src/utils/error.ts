export function rewriteError(e: Error, message: string) {
  const error = new Error(message);
  error.stack = e.stack;
  error.name = e.name;
  error.cause = e.cause;
  return error;
}
