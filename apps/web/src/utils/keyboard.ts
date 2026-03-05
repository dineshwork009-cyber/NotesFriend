import { EventManager } from "@notesfriend/core";

const KeyboardEventManager = new EventManager();

const GlobalKeyboard = {
  addEventListener: (name: string, handler: (...args: any[]) => void) => {
    KeyboardEventManager.subscribe(name, handler);
  },
  removeEventListener: (name: string, handler: (...args: any[]) => void) =>
    KeyboardEventManager.unsubscribe(name, handler)
};

// window.addEventListener("keydown", (e) => {
//   // KeyboardEventManager.publish("keydown", e);
// });

window.addEventListener("keyup", (e) => {
  KeyboardEventManager.publish("keyup", e);
});

export { GlobalKeyboard, KeyboardEventManager };
