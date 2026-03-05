import { KVStorageAccessor } from "../../interfaces.js";
import hosts from "../../utils/constants.js";
import http from "../../utils/http.js";
import { getId } from "../../utils/id.js";
import TokenManager from "../token-manager.js";

export class SyncDevices {
  constructor(
    private readonly kv: KVStorageAccessor,
    private readonly tokenManager: TokenManager
  ) {}

  async register() {
    const deviceId = getId();
    const url = `${hosts.API_HOST}/devices?deviceId=${deviceId}`;
    const token = await this.tokenManager.getAccessToken();
    return http
      .post(url, null, token)
      .then(() => this.kv().write("deviceId", deviceId));
  }

  async unregister() {
    const deviceId = await this.kv().read("deviceId");
    if (!deviceId) return;
    const url = `${hosts.API_HOST}/devices?deviceId=${deviceId}`;
    const token = await this.tokenManager.getAccessToken();
    return http.delete(url, token).then(() => this.kv().delete("deviceId"));
  }

  get() {
    return this.kv().read("deviceId");
  }
}
