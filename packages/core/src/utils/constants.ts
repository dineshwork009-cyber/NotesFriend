import { extractHostname } from "./hostname.js";

const COMPATIBLE_SERVER_VERSION = 1;

export function isServerCompatible(version: number) {
  return COMPATIBLE_SERVER_VERSION === version;
}

function isProduction() {
  return (
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
  );
}

export const hosts = {
  API_HOST: isProduction()
    ? "https://api.notesfriend.com"
    : "http://localhost:5264",
  AUTH_HOST: isProduction()
    ? "https://auth.notesfriend.app"
    : "http://localhost:8264",
  SSE_HOST: isProduction()
    ? "https://events.notesfriend.app"
    : "http://localhost:7264",
  SUBSCRIPTIONS_HOST: isProduction()
    ? "https://subscriptions.notesfriend.app"
    : "http://localhost:9264",
  ISSUES_HOST: isProduction()
    ? "https://issues.notesfriend.app"
    : "http://localhost:2624",
  MONOGRAPH_HOST: isProduction()
    ? "https://monogr.ph"
    : "http://localhost:6264",
  NOTESFRIEND_HOST: isProduction()
    ? "https://notesfriend.com"
    : "http://localhost:8787"
};

export default hosts;

const HOSTNAMES = {
  [extractHostname(hosts.API_HOST)]: "Notesfriend Sync Server",
  [extractHostname(hosts.AUTH_HOST)]: "Authentication Server",
  [extractHostname(hosts.SSE_HOST)]: "Eventing Server",
  [extractHostname(hosts.SUBSCRIPTIONS_HOST)]:
    "Subscriptions Management Server",
  [extractHostname(hosts.ISSUES_HOST)]: "Bug Reporting Server",
  [extractHostname(hosts.MONOGRAPH_HOST)]: "Monograph Server"
};

export const getServerNameFromHost = (host: string) => {
  return HOSTNAMES[host];
};
