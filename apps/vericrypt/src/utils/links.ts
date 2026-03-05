type Packages = "crypto" | "importer" | "enex";
type Apps = "vericrypt" | "importer";

export function getSourceUrl(path: string) {
  const baseUrl = `https://github.com/streetwriters/notesfriend/tree/master/apps/vericrypt`;
  return `${baseUrl}/${path}`;
}

export function getPackageUrl(packageId: Packages) {
  const baseUrl = `https://github.com/streetwriters/notesfriend/tree/master/packages`;
  return `${baseUrl}/${packageId}`;
}

export function getAppUrl(appId: Apps) {
  const baseUrl = `https://github.com/streetwriters/notesfriend/tree/master/apps`;
  return `${baseUrl}/${appId}`;
}
