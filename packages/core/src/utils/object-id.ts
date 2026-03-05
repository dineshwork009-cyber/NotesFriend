const MACHINE_ID = Math.floor(Math.random() * 0xffffff);
const pid = Math.floor(Math.random() * 100000) % 0xffff;
const PROCESS_UNIQUE = MACHINE_ID.toString(16).padStart(6, "0") + pid.toString(16).padStart(4, "0");
let index = Math.floor(Math.random() * 0xffffff);

export function createObjectId(date = Date.now()): string {
  index++;
  const time = Math.floor(date / 1000);

  let timeHex = time.toString(16);
  if (timeHex.length !== 8) timeHex = timeHex.padStart(2, "0").padEnd(8, "0");

  let incHex = swap16(index).toString(16);
  if (incHex.length !== 6) incHex = incHex.padStart(6, "0");

  return timeHex + PROCESS_UNIQUE + incHex;
}

function swap16(val: number) {
  return ((val & 0xff) << 16) | (val & 0xff00) | ((val >> 16) & 0xff);
}

export function getObjectIdTimestamp(id: string) {
  return new Date(parseInt(id.substring(0, 8), 16) * 1000);
}