import platform from "platform";
import { appVersion } from "../utils/version";

export function getPlatform() {
  if (window.os) return window.os();

  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    return "macOS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return "Windows";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else if (!os && /Linux/.test(platform)) {
    return "Linux";
  }

  return os;
}

export function getDownloadLink(platform: string) {
  const baseurl = `https://notesfriend.com/releases/${platform.toLowerCase()}`;
  switch (platform) {
    case "iOS":
      return [
        {
          type: "Install from App Store",
          link: "https://apps.apple.com/pk/app/notesfriend-take-private-notes/id1544027013"
        }
      ];
    case "Android":
      return [
        {
          type: "Install from Google Play Store",
          link: "https://play.google.com/store/apps/details?id=com.streetwriters.notesfriend"
        },
        {
          type: "Download .apk (arm64-v8a)",
          link: `${baseurl}/notesfriend-arm64-v8a.apk`
        },
        {
          type: "Download .apk (armeabi-v7a)",
          link: `${baseurl}/notesfriend-armeabi-v7a.apk`
        },
        {
          type: "Download .apk (x86)",
          link: `${baseurl}/notesfriend-x86.apk`
        },
        {
          type: "Download .apk (x86_64)",
          link: `${baseurl}/notesfriend-x86_64.apk`
        }
      ];
    case "macOS":
      return [
        {
          type: "Download .dmg (x64)",
          link: `${baseurl}/notesfriend_mac_x64.dmg`
        },
        {
          type: "Download .dmg (arm64)",
          link: `${baseurl}/notesfriend_mac_arm64.dmg`
        }
      ];
    case "Windows":
      return [
        {
          type: "Download .exe (x64)",
          link: `${baseurl}/notesfriend_win_x64.exe`
        },
        {
          type: "Download portable .exe (x64)",
          link: `${baseurl}/notesfriend_win_x64_portable.exe`
        }
      ];
    case "Linux":
      return [
        {
          type: "Download .AppImage",
          link: `${baseurl}/notesfriend_linux_x86_64.AppImage`
        },
        {
          type: "Download .deb",
          link: `${baseurl}/notesfriend_linux_amd64.deb`
        },
        {
          type: "Download .rpm",
          link: `${baseurl}/notesfriend_linux_x86_64.rpm`
        }
      ];
    default:
      return [
        {
          type: "Download",
          link: "https://github.com/streetwriters/notesfriend/releases/"
        }
      ];
  }
}

export function isMac() {
  return (
    getPlatform() === "macOS" || getPlatform() === "darwin" || isMacStoreApp()
  );
}

export function isMacStoreApp() {
  return window.os ? window.os() === "mas" : false;
}

export function getDeviceInfo(extras: string[] = []) {
  const version = appVersion.formatted;
  const os = platform.os;
  const browser = `${platform.name} ${platform.version}`;

  return `App version: ${version}
OS: ${os}
Browser: ${browser}
${extras.join("\n")}`;
}
