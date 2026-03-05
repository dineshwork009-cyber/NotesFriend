import { ContentType } from "../types.js";

export async function getContentFromData(type: ContentType, data: string) {
  switch (type) {
    case "tiptap": {
      const { Tiptap } = await import("./tiptap.js");
      return new Tiptap(data);
    }
    default:
      throw new Error(
        `Unknown content type: "${type}". Please report this error at support@notesfriend.app.`
      );
  }
}
