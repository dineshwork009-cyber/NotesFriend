import { getVersion } from "react-native-device-info";

export interface GithubRelease {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: unknown;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: unknown[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  mentions_count: number;
  reactions: unknown;
  discussion_url: string;
}
export type GithubVersionInfo = {
  version: string | null;
  releasedAt: string;
  notes: string;
  body: string;
  url: string;
  lastChecked: string;
  needsUpdate: boolean;
  current: string;
};
export const getGithubVersion = async (): Promise<GithubVersionInfo | null> => {
  const url = `https://api.github.com/repos/streetwriters/notesfriend/releases`;
  let res;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36",
        "sec-fetch-site": "same-origin"
      }
    });
  } catch (e) {
    console.warn(e);
  }

  if (!res?.ok) return null;
  const data = (await res?.json()) as GithubRelease[];

  const versions = data?.filter(
    (tag) =>
      tag.tag_name.endsWith("android") && !tag.tag_name.endsWith("beta-android")
  );
  const latestVersion = versions[0];
  const version = latestVersion.tag_name.replace("-android", "");
  return {
    version: version || null,
    releasedAt: new Date(latestVersion.published_at).toISOString(),
    notes: "",
    body: latestVersion.body,
    url: latestVersion.url,
    lastChecked: new Date().toISOString(),
    needsUpdate: getVersion() !== version,
    current: getVersion()
  };
};
