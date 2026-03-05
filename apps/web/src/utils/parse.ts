export function tryParse(val: string) {
  if (val == "null" || val == "undefined") return;
  try {
    return JSON.parse(val);
  } catch (error) {
    return val;
  }
}
