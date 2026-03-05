import hosts from "../utils/constants.js";

export class Debug {
  static async report(reportData: {
    title: string;
    body: string;
    userId?: string;
  }): Promise<string | undefined> {
    const { title, body, userId } = reportData;
    const response = await fetch(`${hosts.ISSUES_HOST}/create/notesfriend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId })
    });
    if (!response.ok) return;
    const json = await response.json();
    return json.url;
  }
}
