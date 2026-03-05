type Formats = {
  "text/html"?: string;
  "text/markdown"?: string;
  "text/plain": string;
};
const COPYABLE_FORMATS = ["text/html", "text/plain"] as const;
export async function writeToClipboard(formats: Formats) {
  if ("ClipboardItem" in window) {
    const items: Record<string, Blob> = Object.fromEntries(
      COPYABLE_FORMATS.filter((f) => !!formats[f]).map((f) => {
        const content = formats[f];
        if (!content) return [];
        return [f, textToBlob(content, f)] as const;
      })
    );
    return navigator.clipboard.write([new ClipboardItem(items)]);
  } else
    return navigator.clipboard.writeText(
      formats["text/markdown"] || formats["text/plain"]
    );
}

function textToBlob(text: string, type: string) {
  return new Blob([new TextEncoder().encode(text)], { type });
}
