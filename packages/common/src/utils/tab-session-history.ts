import { getId } from "@notesfriend/core";

export type TabHistory = Record<
  string,
  { backStack: string[]; forwardStack: string[] }
>;
export type TabState = {
  tabSessionHistory: TabHistory;
  canGoBack?: boolean;
  canGoForward?: boolean;
};

export class TabSessionHistory {
  constructor(
    public options: {
      set: (state: TabState) => void;
      get: () => TabState;
    }
  ) {}

  getBackStack(id: string) {
    const tabHistory = this.options.get().tabSessionHistory[id];
    if (!tabHistory) return [];
    return tabHistory.backStack.slice();
  }

  getForwardStack(id: string) {
    const tabHistory = this.options.get().tabSessionHistory[id];
    if (!tabHistory) return [];
    return tabHistory.forwardStack.slice();
  }

  setBackStack(id: string, value: string[]) {
    const tabHistory = this.options.get().tabSessionHistory;
    this.options.set({
      canGoBack: value.length > 1,
      tabSessionHistory: {
        ...tabHistory,
        [id]: {
          ...(tabHistory[id] || {}),
          backStack: value
        }
      }
    });
  }

  setForwardStack(id: string, value: string[]) {
    const tabHistory = this.options.get().tabSessionHistory;
    this.options.set({
      canGoForward: value.length > 0,
      tabSessionHistory: {
        ...tabHistory,
        [id]: {
          ...(tabHistory[id] || {}),
          forwardStack: value
        }
      }
    });
  }

  add(id: string, sessionId?: string) {
    sessionId = sessionId || getId();
    const back_stack = this.getBackStack(id);
    back_stack.push(sessionId);
    this.setBackStack(id, back_stack);
    this.setForwardStack(id, []);
    return sessionId;
  }

  clearStackForTab(tabId: string) {
    this.options.set({
      tabSessionHistory: {
        ...this.options.get().tabSessionHistory,
        [tabId]: {
          backStack: [],
          forwardStack: []
        }
      }
    });
  }

  back(id: string): string | null {
    if (!this.canGoBack(id)) return null;

    const backStack = this.getBackStack(id);
    const forwardStack = this.getForwardStack(id);

    const currentItem = backStack.pop();
    const nextItem = backStack[backStack.length - 1];

    currentItem && forwardStack.push(currentItem);

    this.setForwardStack(id, forwardStack);
    this.setBackStack(id, backStack);

    return nextItem;
  }

  remove(tabId: string, sessionId: string) {
    const backStack = this.getBackStack(tabId);
    let index = backStack.lastIndexOf(sessionId);
    if (index === -1) {
      const forwardStack = this.getForwardStack(tabId);
      index = forwardStack.lastIndexOf(sessionId);
      forwardStack.splice(index, 1);
      this.setForwardStack(tabId, forwardStack);
    } else {
      backStack.splice(index, 1);
      this.setBackStack(tabId, backStack);
    }
  }

  forward(id: string): string | null {
    if (!this.canGoForward(id)) return null;

    const backStack = this.getBackStack(id);
    const forwardStack = this.getForwardStack(id);

    const item = forwardStack.pop() as string;
    this.setForwardStack(id, forwardStack);
    backStack.push(item);
    this.setBackStack(id, backStack);
    return item;
  }

  currentSessionId(id: string) {
    const { back } = this.getTabHistory(id);
    return back[back.length - 1];
  }

  getTabHistory(id: string) {
    const tabHistory = this.options.get().tabSessionHistory[id];
    if (!tabHistory)
      return {
        back: [],
        forward: []
      };

    return {
      back: tabHistory.backStack?.slice() || [],
      forward: tabHistory.forwardStack?.slice() || []
    };
  }

  canGoBack(id: string) {
    const tabHistory = this.options.get().tabSessionHistory[id];
    if (!tabHistory) return false;
    return tabHistory.backStack.length > 1;
  }

  canGoForward(id: string) {
    const tabHistory = this.options.get().tabSessionHistory[id];
    if (!tabHistory) return false;
    return tabHistory.forwardStack.length >= 1;
  }
}
