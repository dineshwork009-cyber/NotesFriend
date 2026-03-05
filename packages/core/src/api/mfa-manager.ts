import http from "../utils/http.js";
import constants from "../utils/constants.js";
import TokenManager from "./token-manager.js";

const ENDPOINTS = {
  setup: "/mfa",
  enable: "/mfa",
  disable: "/mfa",
  recoveryCodes: "/mfa/codes",
  send: "/mfa/send"
};

class MFAManager {
  constructor(private readonly tokenManager: TokenManager) {}

  async setup(type: "app" | "sms" | "email", phoneNumber?: string) {
    const token = await this.tokenManager.getAccessToken();
    if (!token) return;
    return await http.post(
      `${constants.AUTH_HOST}${ENDPOINTS.setup}`,
      {
        type,
        phoneNumber
      },
      token
    );
  }

  async enable(type: "app" | "sms" | "email", code: string) {
    return this._enable(type, code, false);
  }

  /**
   *
   * @param {"app" | "sms" | "email"} type
   * @param {string} code
   * @returns
   */
  async enableFallback(type: "app" | "sms" | "email", code: string) {
    return this._enable(type, code, true);
  }

  async _enable(
    type: "app" | "sms" | "email",
    code: string,
    isFallback: boolean
  ) {
    const token = await this.tokenManager.getAccessToken();
    if (!token) return;
    return await http.patch(
      `${constants.AUTH_HOST}${ENDPOINTS.enable}`,
      { type, code, isFallback },
      token
    );
  }

  async disable() {
    const token = await this.tokenManager.getAccessToken();
    if (!token) return;
    return await http.delete(
      `${constants.AUTH_HOST}${ENDPOINTS.disable}`,
      token
    );
  }

  async codes() {
    const token = await this.tokenManager.getAccessToken();
    if (!token) return;
    return await http.get(
      `${constants.AUTH_HOST}${ENDPOINTS.recoveryCodes}`,
      token
    );
  }

  async sendCode(method: "sms" | "email") {
    const token = await this.tokenManager.getAccessToken([
      "IdentityServerApi",
      "auth:grant_types:mfa"
    ]);
    if (!token) throw new Error("Unauthorized.");

    return await http.post(
      `${constants.AUTH_HOST}${ENDPOINTS.send}`,
      {
        type: method
      },
      token
    );
  }
}

export default MFAManager;
