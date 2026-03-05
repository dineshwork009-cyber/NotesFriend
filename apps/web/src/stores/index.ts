import { StateCreator } from "zustand";

type NNStoreCreator<T> = StateCreator<
  T,
  [["zustand/subscribeWithSelector", never], ["zustand/mutative", never]]
>;

export type GetState<T> = Parameters<NNStoreCreator<T>>[1];
export type SetState<T> = Parameters<NNStoreCreator<T>>[0];

export interface IStore<T extends object> {
  new (set: SetState<T>, get: GetState<T>): T;
}

export default class BaseStore<T extends object> {
  constructor(
    private readonly setState: SetState<T>,
    readonly get: GetState<T>
  ) {}

  set(
    nextStateOrUpdater: Parameters<SetState<T>>[0],
    shouldReplace?: boolean | undefined
  ) {
    this.setState(
      typeof nextStateOrUpdater === "function"
        ? (state) => {
            nextStateOrUpdater(state);
          }
        : nextStateOrUpdater,
      shouldReplace
    );
  }
}
