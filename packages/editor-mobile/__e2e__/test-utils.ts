import {
  AndroidDevice,
  BrowserContext,
  TestInfo,
  _android as android,
  test
} from "@playwright/test";
import { Keyboard, SUPPORTED_KEYBOARDS, getKeyboards } from "./keyboard-utils";
import * as ip from "ip";
import { DeviceSize, getDeviceSize } from "./device-utils";

type AndroidTestArgs = {
  chrome: BrowserContext;
  device: AndroidDevice;
  baseURL: string;
  keyboards: Keyboard[];
  size: DeviceSize;
};

const SERVER_ADDRESS = `http://${ip.address("Wi-Fi", "ipv4")}:3000`;

export function androidTest(
  title: string,
  testFunction: (
    args: AndroidTestArgs,
    testInfo: TestInfo
  ) => Promise<void> | void
) {
  test(title, async ({ channel: _ }, testInfo) => {
    const [device] = await android.devices();
    if (!device) {
      console.error("Please connect an Android device or emulator.");
      return;
    }

    const keyboards = await getKeyboards(device);
    if (!keyboards.length) {
      console.error(
        "No supported keyboard found. Please install one of",
        SUPPORTED_KEYBOARDS
      );
      return;
    }

    const deviceSize = await getDeviceSize(device);

    await device.shell("am force-stop com.android.chrome");
    const chrome = await device.launchBrowser({});

    await testFunction(
      {
        chrome: chrome,
        device,
        keyboards,
        baseURL: SERVER_ADDRESS,
        size: deviceSize
      },
      testInfo
    );

    await device.shell("am force-stop com.android.chrome");
    await device.close();
  });
}
