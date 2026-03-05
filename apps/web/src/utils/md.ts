import snarkdown from "snarkdown";

function addAttributes(
  html: string,
  tag: keyof HTMLElementTagNameMap,
  attributes: Record<string, string>
) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const elements = temp.querySelectorAll(tag);
  elements.forEach((element) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  });
  return temp.innerHTML;
}

export function mdToHtml(markdown: string) {
  return addAttributes(snarkdown(markdown), "a", { target: "_blank" });
}
