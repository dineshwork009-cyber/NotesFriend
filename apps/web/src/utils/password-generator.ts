export function generatePassword() {
  return window.crypto
    .getRandomValues(new BigUint64Array(4))
    .reduce((prev, curr, index) => {
      const char =
        index % 2 ? curr.toString(36).toUpperCase() : curr.toString(36);
      return prev + char;
    }, "")
    .split("")
    .sort(() => 128 - window.crypto.getRandomValues(new Uint8Array(1))[0])
    .join("");
}
