import hosts from "../utils/constants.js";
import http from "../utils/http.js";

export class HealthCheck {
  static async auth() {
    return check(hosts.AUTH_HOST);
  }
}

export async function check(host: string) {
  try {
    const response = await http.get(`${host}/health`);
    return response.trim() === "Healthy";
  } catch {
    return false;
  }
}
