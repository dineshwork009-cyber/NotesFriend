export async function getChangelog(tag: string) {
  try {
    if (!tag) return "No changelog found.";

    const url = `https://api.github.com/repos/streetwriters/notesfriend/releases/tags/v${tag}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) return "No changelog found.";

    const release = await response.json();
    if (!release || !release.body) return "No changelog found.";

    const { body } = release;
    return body;
  } catch (e) {
    console.error(e);
    return "No changelog found.";
  }
}
