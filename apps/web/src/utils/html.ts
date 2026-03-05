export function h(
  tag: keyof HTMLElementTagNameMap | "text",
  children: (HTMLElement | string)[] = [],
  attr: Record<string, string | undefined> = {}
) {
  const element = document.createElement(tag);
  element.append(
    ...children.map((v) =>
      typeof v === "string" ? document.createTextNode(v) : v
    )
  );
  for (const key in attr) {
    const value = attr[key];
    if (value) element.setAttribute(key, value);
  }
  return element;
}

export function text(text: string) {
  return document.createTextNode(text);
}
