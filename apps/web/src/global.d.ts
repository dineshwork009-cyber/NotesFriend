/* eslint-disable no-var */

import "vite/client";
import "vite-plugin-svgr/client";
import "@notesfriend/desktop/dist/preload";
import type { Database } from "@notesfriend/core";

declare global {
  var PUBLIC_URL: string;
  var APP_VERSION: string;
  var GIT_HASH: string;
  var IS_DESKTOP_APP: boolean;
  var IS_TESTING: boolean;
  var PLATFORM: "web" | "desktop";
  var IS_BETA: boolean;
  var APP_TITLE: string;
  var IS_THEME_BUILDER: boolean;
  var hasNativeTitlebar: boolean;

  interface AuthenticationExtensionsClientInputs {
    prf?: {
      eval: {
        first: BufferSource;
      };
    };
  }

  interface AuthenticationExtensionsClientOutputs {
    prf?: {
      enabled?: boolean;
      results?: {
        first: ArrayBuffer;
      };
    };
  }

  interface PublicKeyCredentialRequestOptions {
    hints?: ("security-key" | "client-device" | "hybrid")[];
  }
  interface PublicKeyCredentialCreationOptions {
    hints?: ("security-key" | "client-device" | "hybrid")[];
  }

  interface FileSystemFileHandle {
    createSyncAccessHandle(options?: {
      mode: "read-only" | "readwrite" | "readwrite-unsafe";
    }): Promise<FileSystemSyncAccessHandle>;
  }
  interface Navigator {
    windowControlsOverlay?: {
      getTitlebarAreaRect(): DOMRect;
      visible: boolean;
    };
  }
  interface Window {
    ApplePaySession?: {
      canMakePayments(): boolean | Promise<boolean>;
    };
    ReactNativeWebView?: {
      postMessage(message: string): void;
    };
  }
}
