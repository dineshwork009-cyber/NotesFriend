export function hasRequire() {
  return (
    typeof require === "function" &&
    // eslint-disable-next-line no-undef, @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (typeof IS_DESKTOP_APP === "undefined" || !IS_DESKTOP_APP)
  );
}
