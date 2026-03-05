import hosts from "../utils/constants.js";
import http from "../utils/http.js";
import Database from "./index.js";

export type CirclePartner = {
  id: string;
  name: string;
  url: string;
  logoBase64: string;
  shortDescription: string;
  longDescription: string;
  offerDescription: string;
  codeRedeemUrl?: string;
};
export class Circle {
  constructor(private readonly db: Database) {}

  partners(): Promise<CirclePartner[] | undefined> {
    return http.get(`${hosts.SUBSCRIPTIONS_HOST}/circle/partners`);
  }

  async redeem(partnerId: string): Promise<{ code?: string } | undefined> {
    const token = await this.db.tokenManager.getAccessToken();
    return http.get(
      `${hosts.SUBSCRIPTIONS_HOST}/circle/redeem?partnerId=${partnerId}`,
      token
    );
  }
}
