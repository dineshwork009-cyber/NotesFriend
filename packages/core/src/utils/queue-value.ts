export class QueueValue<T> {
  #counter: number;
  constructor(readonly value: T, private readonly destructor: () => void) {
    this.#counter = 0;
  }

  use() {
    this.#counter++;
    return this.value;
  }

  discard() {
    this.#counter--;
    if (this.#counter === 0) this.destructor();
  }
}
