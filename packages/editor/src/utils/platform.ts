export const isiOS =
  "navigator" in globalThis &&
  ([
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document));

export const isAndroid =
  "navigator" in globalThis &&
  navigator.userAgent.toLowerCase().indexOf("android") > -1;
