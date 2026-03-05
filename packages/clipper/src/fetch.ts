export type FetchOptions = {
  bypassCors?: boolean;
  corsHost: string;
  noCache?: boolean;
  crossOrigin?: "anonymous" | "use-credentials" | null;
};

export async function fetchResource(url: string, options?: FetchOptions) {
  if (!url) return null;

  const response = await fetch(constructUrl(url, options));
  if (!response.ok) return "";

  const blob = await response.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string>((resolve) => {
    reader.addEventListener("loadend", () => {
      if (typeof reader.result === "string") resolve(reader.result);
    });
  });
}

export function createImage(
  url: string,
  options?: FetchOptions
): Promise<HTMLImageElement | null> {
  if (url === "data:,") return Promise.resolve(null);
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    const image = new Image();
    image.crossOrigin = options?.crossOrigin || null;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = () => reject(new Error("Failed to render image."));
    image.src = constructUrl(url, options);
  });
}

export function reloadImage(image: HTMLImageElement, options: FetchOptions) {
  if (options.corsHost && image.currentSrc.startsWith(options.corsHost))
    return Promise.resolve(null);

  options.noCache = true;
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    image.crossOrigin = options.crossOrigin || null;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = (e) => {
      console.error("Failed to load image", image.currentSrc);
      reject(e);
    };

    image.src = constructUrl(image.currentSrc, options);
  });
}

export function constructUrl(url: string, options?: FetchOptions) {
  if (!url.startsWith("http")) return url;
  if (options?.noCache) {
    // Cache bypass so we dont have CORS issues with cached images
    // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
    url += (/\?/.test(url) ? "&" : "?") + Date.now();
  }
  if (options?.bypassCors && options?.corsHost) {
    if (url.startsWith(options.corsHost)) return url;

    url = `${options.corsHost}/${url}`;
  }
  return url;
}
