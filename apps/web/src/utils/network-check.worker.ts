import { expose } from "comlink";

const module = {
  async waitForInternet() {
    let retries = 3;
    while (retries-- > 0) {
      try {
        const response = await fetch("https://api.notesfriend.com/health");
        if (response.ok) return true;
      } catch {
        // ignore
      }

      // wait a bit before trying again.
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
    return false;
  }
};

expose(module);
export type NetworkCheck = typeof module;
