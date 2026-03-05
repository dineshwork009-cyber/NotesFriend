import { FunctionComponent, PropsWithChildren } from "react";
import { flushSync } from "react-dom";
import { EventDispatcher } from "./event-dispatcher.js";
import { Root, createRoot } from "react-dom/client";

export type BasePortalProviderProps = PropsWithChildren<unknown>;

export type Portals = Map<HTMLElement, MountedPortal>;

export interface MountedPortal {
  key: string;
  Component: FunctionComponent;
}

export type PortalRendererState = {
  portals: Portals;
};

export class PortalProviderAPI extends EventDispatcher<Portals> {
  portals: Map<HTMLElement, MountedPortal> = new Map();
  roots: Map<HTMLElement, Root> = new Map();

  constructor() {
    super();
  }

  render(Component: FunctionComponent, container: HTMLElement) {
    const root = this.roots.get(container) || createRoot(container);
    flushSync(() => root.render(<Component />));
    this.roots.set(container, root);
  }

  remove(container: HTMLElement) {
    // if container is already unmounted (maybe by prosemirror),
    // no need to proceed
    if (!container.parentNode) return;

    const root = this.roots.get(container);
    if (!root) return;
    this.roots.delete(container);

    try {
      root.unmount();
    } catch {
      // ignore
    }
  }
}
