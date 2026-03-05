const INVALID_ELEMENTS = ["script", "noscript"];

type CloneNodeOptions = {
  images?: boolean;
  styles?: boolean;
};

export function cloneNode(node: HTMLElement, options: CloneNodeOptions) {
  node = node.cloneNode(true) as HTMLElement;
  const images = node.querySelectorAll("img");
  if (!options.images) {
    for (const image of images) image.remove();
  } else {
    for (const image of images) {
      image.src = image.currentSrc;
    }
  }

  if (!options.styles) {
    const elements = node.querySelectorAll(
      `button, form, select, input, textarea`
    );
    for (const element of elements) element.remove();
  }

  const invalidElements = node.querySelectorAll(INVALID_ELEMENTS.join(","));
  for (const element of invalidElements) element.remove();
  return node;
}
