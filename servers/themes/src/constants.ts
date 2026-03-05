import path from "path";
import { fileURLToPath } from "url";
import { FsCounter } from "./counter/fs";
import { readSecrets } from "./secrets";
import { KVCounter } from "./counter/kv";

const env = readSecrets([
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_AUTH_TOKEN",
  "CLOUDFLARE_INSTALLS_KV_NAMESPACE_ID"
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const THEMES_REPO_URL =
  process.env.THEMES_REPO_URL ||
  "https://github.com/streetwriters/notesfriend-themes.git";

export const THEME_REPO_DIR_NAME = "notesfriend-themes";
export const THEME_METADATA_JSON = path.join(__dirname, "themes-metadata.json");
export const THEME_REPO_DIR_PATH = path.resolve(
  path.join(__dirname, "..", THEME_REPO_DIR_NAME)
);
export const InstallsCounter =
  env.CLOUDFLARE_ACCOUNT_ID &&
  env.CLOUDFLARE_AUTH_TOKEN &&
  env.CLOUDFLARE_INSTALLS_KV_NAMESPACE_ID
    ? new KVCounter({
        cfAccountId: env.CLOUDFLARE_ACCOUNT_ID,
        cfAuthToken: env.CLOUDFLARE_AUTH_TOKEN,
        namespaceId: env.CLOUDFLARE_INSTALLS_KV_NAMESPACE_ID
      })
    : new FsCounter(path.join(path.dirname(__dirname), "..", "installs.json"));
