import { FetchOptions, fetchResource } from "./fetch.js";
import { isDataUrl } from "./utils.js";

async function inlineAllImages(root: HTMLElement, options?: FetchOptions) {
  const imageNodes = root.querySelectorAll("img");
  const promises: Promise<any>[] = [];
  for (let i = 0; i < imageNodes.length; ++i) {
    const image = imageNodes[i];
    promises.push(inlineImage(image, options));
  }

  await Promise.allSettled(promises).catch((e) => console.error(e));
}
export { inlineAllImages };

async function inlineImage(element: HTMLImageElement, options?: FetchOptions) {
  if (isDataUrl(element.currentSrc)) return Promise.resolve(null);

  const dataURL = await fetchResource(
    element.currentSrc || element.src,
    options
  );
  if (!dataURL) return null;

  if (dataURL === "data:,") {
    element.removeAttribute("src");
    return element;
  }

  if (element.parentElement?.tagName === "PICTURE") {
    element.parentElement?.replaceWith(element);
  }

  element.src = dataURL;
  element.removeAttribute("srcset");
}
