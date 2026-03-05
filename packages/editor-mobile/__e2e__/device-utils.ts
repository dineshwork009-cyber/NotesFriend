import { AndroidDevice } from "@playwright/test";
export type DeviceSize = {
  width: number;
  height: number;
  /**
   * Convert device independent height to device specific height
   */
  h: (percentage: number) => number;
  /**
   * Convert device independent width to device specific width
   */
  w: (percentage: number) => number;
};
export async function getDeviceSize(
  device: AndroidDevice
): Promise<DeviceSize> {
  const output = (await device.shell(`wm size`)).toString("utf-8");
  const parsed = /(\d+)x(\d+)/g.exec(output);
  if (!parsed) throw new Error("Failed to find device size.");

  const width = parseInt(parsed[1]);
  const height = parseInt(parsed[2]);
  return {
    height,
    width,
    h: (p) => p * height,
    w: (p) => p * width
  };
}
