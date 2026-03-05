function isBeta(cookie: string) {
  console.log("Checking cookie:", cookie);
  const releaseTrack = cookie
    .split("; ")
    .find((row) => row.startsWith("release-track="))
    ?.split("=")[1];
  return releaseTrack === "beta";
}

interface Env {
  BETA_BASE_URL: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  try {
    const url = new URL(request.url);
    const response = await (async () => {
      if (isBeta(request.headers.get("Cookie") || "") && env.BETA_BASE_URL) {
        const betaUrl = new URL(env.BETA_BASE_URL);
        betaUrl.pathname = url.pathname;
        betaUrl.search = url.search;
        console.log("Fetching asset from beta URL:", betaUrl.toString());
        const asset = await fetch(betaUrl, {
          headers: request.headers,
          method: request.method,
          body: request.body
        });
        return new Response(asset.body, asset);
      } else {
        return await next();
      }
    })();
    return response;
  } catch (thrown) {
    console.error("Error occurred:", thrown);
    return new Response(thrown);
  }
};
