const { version } = require("../package.json");

const ICONS = {
  16: "16x16.png",
  32: "32x32.png",
  48: "48x48.png",
  64: "64x64.png",
  128: "128x128.png",
  256: "256x256.png"
};
const BACKGROUND_SCRIPT = "background.bundle.js";
const ACTION = {
  default_icon: ICONS,
  default_title: "Notesfriend Web Clipper",
  default_popup: "popup.html"
};

const nnHost =
  process.env.NODE_ENV === "production"
    ? "*://app.notesfriend.com/*"
    : "*://localhost/*";
const v3nnHost = "*://v3.notesfriend.com/*";
const corsHost = "https://cors.notesfriend.com/*";
const common = {
  name: "Notesfriend Web Clipper",
  version,
  description:
    "Clip web pages & save interesting things you find on the web directly into Notesfriend in a private & secure way.",
  permissions: ["activeTab", "tabs", "storage", "notifications"],
  icons: ICONS
};

const v2 = {
  ...common,
  permissions: [...common.permissions, corsHost, nnHost, v3nnHost],
  optional_permissions: ["http://*/*", "https://*/*"],
  browser_specific_settings: {
    gecko: {
      id: "notesfriend-web-clipper-unlisted@notesfriend.com",
      strict_min_version: "105.0"
    }
  },
  manifest_version: 2,
  background: {
    scripts: [BACKGROUND_SCRIPT]
  },
  browser_action: ACTION
};

const v3 = {
  ...common,
  permissions: [...common.permissions, "scripting"],
  host_permissions: [corsHost, nnHost],
  optional_host_permissions: ["http://*/*", "https://*/*"],
  manifest_version: 3,
  background: {
    service_worker: BACKGROUND_SCRIPT
  },
  action: ACTION
};

module.exports = {
  v2,
  v3
};
