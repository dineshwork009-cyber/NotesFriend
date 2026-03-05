export class LazyPromise<T> {
  private _promise: Promise<T>;
  private _resolve?: (result: T) => void;
  constructor() {
    this._promise = new Promise((resolve) => (this._resolve = resolve));
  }

  resolve(result: T) {
    this._resolve?.(result);
  }

  get promise() {
    return this._promise;
  }
}
