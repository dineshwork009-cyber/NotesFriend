import { CLIENT_ID } from "../common.js";
import hosts from "../utils/constants.js";
import http from "../utils/http.js";

export class Offers {
  static async getCode(promo: string, platform: "ios" | "android" | "web") {
    const result = await http.get(
      `${hosts.SUBSCRIPTIONS_HOST}/offers?promoCode=${promo}&clientId=${CLIENT_ID}&platformId=${platform}`
    );
    return result.code;
  }
}
