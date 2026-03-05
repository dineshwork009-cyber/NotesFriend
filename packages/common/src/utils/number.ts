export function nth(number: number) {
  return (
    ["st", "nd", "rd"][
      (((((number < 0 ? -number : number) + 90) % 100) - 10) % 10) - 1
    ] || "th"
  );
}
