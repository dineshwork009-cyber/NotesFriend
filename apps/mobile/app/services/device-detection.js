import { Dimensions, PixelRatio, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

let windowSize = Dimensions.get("window");
let screenSize = Dimensions.get("screen");
export class DeviceDetectionService {
  constructor() {
    this.setNewValues();
  }

  isTablet() {
    return DeviceInfo.isTablet();
  }
  setNewValues() {
    screenSize = Dimensions.get("screen");
    windowSize = Dimensions.get("window");
    this.pixelDensity = PixelRatio.get();
    this.width = windowSize.width;
    this.height = windowSize.height;
    this.adjustedWidth = this.width * this.pixelDensity;
    this.adjustedHeight = this.height * this.pixelDensity;
    this.screenWidth = screenSize.width;
    this.screenHeight = screenSize.height;
    this.isPhoneOrTablet();
    this.isIosOrAndroid();
    this.detectIphoneX();
    this.checkSmallTab();
  }

  setSize(size, orientation) {
    windowSize = size || windowSize;
    this.width = windowSize.width;
    this.height = windowSize.height;
    this.orientation = orientation;
    this.adjustedWidth = this.width * this.pixelDensity;
    this.adjustedHeight = this.height * this.pixelDensity;
    screenSize = Dimensions.get("screen");
    this.screenWidth = screenSize.width;
    this.screenHeight = screenSize.height;
    this.isPhoneOrTablet();
    this.isIosOrAndroid();
    this.detectIphoneX();
    this.checkSmallTab(orientation);
  }

  getDeviceSize = () => {
    let size = this.width / 100;
    return size;
  };

  getScreenSize = () => {
    let size = this.screenWidth / 100;
    return size;
  };

  checkSmallTab(orientation) {
    let deviceSize = this.getDeviceSize();

    const isLandscape = orientation?.startsWith("LANDSCAPE");
    const isValidTabletSize = deviceSize > 5.5;
    const isValidLargeTabletSize = deviceSize > 9;

    if (
      (!this.isTablet() && isLandscape && isValidTabletSize) ||
      (this.isTablet() && isValidTabletSize && !isValidLargeTabletSize)
    ) {
      this.isTab = true;
      this.isPhone = false;
      this.isSmallTab = true;
    } else if (this.isTablet() && isLandscape && isValidLargeTabletSize) {
      this.isTab = true;
      this.isPhone = false;
      this.isSmallTab = false;
    } else {
      if (!this.isTablet() || deviceSize < 5.5) {
        this.isTab = false;
        this.isPhone = true;
        this.isSmallTab = false;
      } else {
        this.isTab = true;
        this.isSmallTab = true;
        this.isPhone = false;
      }
    }
  }

  isPhoneOrTablet() {
    if (this.isTablet()) {
      this.isTab = true;
      this.isPhone = false;
    } else {
      this.isTab = false;
      this.isPhone = false;
    }
  }

  isIosOrAndroid() {
    if (Platform.OS === "ios") {
      this.isIos = true;
      this.isAndroid = false;
    } else {
      this.isIos = false;
      this.isAndroid = true;
    }
  }

  detectIphoneX() {
    this.isIphoneX =
      Platform.OS === "ios" &&
      !Platform.isTVOS &&
      !Platform.isTVOS &&
      (windowSize.height === 812 || windowSize.width === 812);
  }

  isLargeTablet() {
    return this.isTab && !this.isSmallTab;
  }
}

export const DDS = new DeviceDetectionService();
