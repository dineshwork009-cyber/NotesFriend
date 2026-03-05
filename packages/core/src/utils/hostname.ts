export function extractHostname(url: string) {
  //find & remove protocol (http, ftp, etc.) and get hostname
  const hostname: string =
    url.indexOf("//") > -1 ? url.split("/")[2] : url.split("/")[0];

  //find & remove port number
  // hostname = hostname.split(":")[0];
  //find & remove "?"
  return hostname.split("?")[0];
}
