/* eslint-disable @typescript-eslint/no-explicit-any */

interface DebouncedFunction<
  Args extends any[],
  F extends (...args: Args) => any
> {
  (this: ThisParameterType<F>, ...args: Args & Parameters<F>): void;
}

interface DebouncedFunctionWithId<
  Args extends any[],
  F extends (...args: Args) => any
> {
  (
    this: ThisParameterType<F>,
    id: string | number,
    ...args: Args & Parameters<F>
  ): void;
}

export function debounce<Args extends any[], F extends (...args: Args) => void>(
  func: F,
  waitFor: number
): DebouncedFunction<Args, F> {
  let timeout: number | null;

  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor) as unknown as number;
  };
}

export function debounceWithId<
  Args extends any[],
  F extends (...args: Args) => void
>(func: F, waitFor: number): DebouncedFunctionWithId<Args, F> {
  let timeout: number | null;
  let debounceId: string | number | null = null;

  return (id: string | number, ...args: Parameters<F>) => {
    if (timeout && id === debounceId) clearTimeout(timeout);
    debounceId = id;
    timeout = setTimeout(() => {
      func(...args);
    }, waitFor) as unknown as number;
  };
}

const DEBOUNCE_TIMEOUTS: Record<string, NodeJS.Timeout> = {};
export function inlineDebounce(id: string, func: () => void, waitFor: number) {
  clearTimeout(DEBOUNCE_TIMEOUTS[id]);
  DEBOUNCE_TIMEOUTS[id] = setTimeout(func, waitFor);
}
