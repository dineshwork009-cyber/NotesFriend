import { InboxApiKey } from "../types.js";
import http from "../utils/http.js";
import constants from "../utils/constants.js";
import TokenManager from "./token-manager.js";
import Database from "./index.js";

const ENDPOINTS = {
  inboxApiKeys: "/inbox/api-keys"
};

export class InboxApiKeys {
  constructor(
    private readonly db: Database,
    private readonly tokenManager: TokenManager
  ) {}

  async get() {
    const user = await this.db.user.getUser();
    if (!user) return;

    const token = await this.tokenManager.getAccessToken();
    if (!token) return;

    const inboxApiKeys = await http.get(
      `${constants.API_HOST}${ENDPOINTS.inboxApiKeys}`,
      token
    );
    return inboxApiKeys as InboxApiKey[];
  }

  async revoke(key: string) {
    const user = await this.db.user.getUser();
    if (!user) return;

    const token = await this.tokenManager.getAccessToken();
    if (!token) return;

    await http.delete(
      `${constants.API_HOST}${ENDPOINTS.inboxApiKeys}/${key}`,
      token
    );
  }

  async create(name: string, expiryDuration: number) {
    const user = await this.db.user.getUser();
    if (!user) return;

    const token = await this.tokenManager.getAccessToken();
    if (!token) return;

    const payload: Omit<InboxApiKey, "lastUsedAt" | "key" | "dateCreated"> = {
      name,
      expiryDate: expiryDuration === -1 ? -1 : Date.now() + expiryDuration
    };
    await http.post.json(
      `${constants.API_HOST}${ENDPOINTS.inboxApiKeys}`,
      payload,
      token
    );
  }
}
