import { Parser } from "htmlparser2";

const ALLOWED_ATTRIBUTES = ["href", "src", "data-hash"];

export function isHTMLEqual(one: unknown, two: unknown) {
  if (typeof one !== "string" || typeof two !== "string") return false;

  return toDiffable(one) === toDiffable(two);
}

function toDiffable(html: string) {
  let text = "";
  const parser = new Parser(
    {
      ontext: (data) => (text += data.trim()),
      onopentag: (_name, attr) => {
        for (const key of ALLOWED_ATTRIBUTES) {
          const value = attr[key];
          if (!value) continue;
          text += value.trim();
        }
      }
    },
    {
      lowerCaseTags: false
      // parseAttributes: true
    }
  );
  parser.end(html);
  return text;
}
