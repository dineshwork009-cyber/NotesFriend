import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import TypedEventEmitter from "typed-emitter";

export type AppEvents = {
  onCreateItem(name: "note" | "notebook" | "reminder"): void;
};

const emitter = new EventEmitter();
const typedEmitter = emitter as TypedEventEmitter<AppEvents>;
const t = initTRPC.create();

export const bridgeRouter = t.router({
  onCreateItem: createSubscription("onCreateItem")
});

export const bridge: AppEvents = new Proxy({} as AppEvents, {
  get(_t, name) {
    if (typeof name === "symbol") return;
    return (...args: unknown[]) => {
      emitter.emit(name, ...args);
    };
  }
});

function createSubscription<TName extends keyof AppEvents>(eventName: TName) {
  return t.procedure.subscription(() => {
    return observable<Parameters<AppEvents[TName]>[0]>((emit) => {
      const listener: AppEvents[TName] = (...args: any[]) => {
        emit.next(args[0]);
      };
      typedEmitter.addListener(eventName, listener);
      return () => {
        typedEmitter.removeListener(eventName, listener);
      };
    });
  });
}
