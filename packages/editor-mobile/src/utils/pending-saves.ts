import { postAsyncWithTimeout, randId } from ".";
import { EditorEvents } from "./editor-events";

class PendingSaveRequests {
  static TITLES = "pendingTitles";
  static CONTENT = "pendingContents";

  async setTitle(value: any) {
    const pendingTitles = JSON.parse(
      this.get(PendingSaveRequests.TITLES) || "[]"
    );

    (pendingTitles as any[]).push({
      id: randId("title-pending"),
      params: value
    });
    return localStorage.setItem(
      PendingSaveRequests.TITLES,
      JSON.stringify(pendingTitles)
    );
  }

  async getPendingTitles() {
    const pendingTitles = JSON.parse(
      this.get(PendingSaveRequests.TITLES) || "[]"
    );
    return pendingTitles;
  }

  async setContent(value: any) {
    const pendingContents = JSON.parse(
      this.get(PendingSaveRequests.CONTENT) || "[]"
    );

    (pendingContents as any[]).push({
      id: randId("content-pending"),
      params: value
    });
    return localStorage.setItem(
      PendingSaveRequests.CONTENT,
      JSON.stringify(pendingContents)
    );
  }

  async getPendingContent() {
    const pendingContents = this.get(PendingSaveRequests.CONTENT);
    return JSON.parse(pendingContents || "[]");
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    return localStorage.removeItem(key);
  }

  clear() {
    return localStorage.clear();
  }

  keys() {
    return localStorage.keys();
  }

  async getPendingTitleIds() {
    const pendingTitles = await this.getPendingTitles();
    return (pendingTitles as any[]).map((pending) => pending.id);
  }

  async getPendingContentIds() {
    const pendingContents = await this.getPendingContent();
    return (pendingContents as any[]).map((pending) => pending.id);
  }

  async removePendingTitlesById(ids: string[]) {
    const pendingTitles = await this.getPendingTitles();
    const filtered = (pendingTitles as any[]).filter(
      (pending) => !ids.includes(pending.id)
    );
    return localStorage.setItem(
      PendingSaveRequests.TITLES,
      JSON.stringify(filtered)
    );
  }

  async removePendingContentsById(ids: string[]) {
    const pendingContents = await this.getPendingContent();
    const filtered = (pendingContents as any[]).filter(
      (pending) => !ids.includes(pending.id)
    );
    return localStorage.setItem(
      PendingSaveRequests.CONTENT,
      JSON.stringify(filtered)
    );
  }

  async postPendingRequests() {
    const postPendingTitles = async () => {
      const pendingTitles = await this.getPendingTitles();
      this.remove(PendingSaveRequests.TITLES);
      for (const pending of pendingTitles) {
        if (pending.params[0]) pending.params[0].pendingChanges = true;
        await postAsyncWithTimeout(EditorEvents.title, ...pending.params);
      }
    };

    const postPendingContent = async () => {
      const pendingContents = await this.getPendingContent();
      this.remove(PendingSaveRequests.CONTENT);
      for (const pending of pendingContents) {
        if (pending.params[0]) pending.params[0].pendingChanges = true;
        await postAsyncWithTimeout(EditorEvents.content, ...pending.params);
      }
    };

    await postPendingTitles();
    await postPendingContent();
  }
}

export const pendingSaveRequests = new PendingSaveRequests();
