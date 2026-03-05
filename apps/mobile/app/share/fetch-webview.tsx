import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { Platform } from "react-native";
import RNFetchBlob from "react-native-blob-util";
import WebView from "react-native-webview";
import { Config } from "./store";
import { db } from "../common/database";

export const fetchHandle = createRef<{
  processUrl: (url: string) => Promise<string | null>;
}>();

export const HtmlLoadingWebViewAgent = React.memo(
  () => {
    const [source, setSource] = useState<string | null>(null);
    const [clipper, setClipper] = useState<string | null>(null);
    const loadHandler = useRef<((result?: boolean | null) => void) | null>(
      null
    );
    const htmlHandler = useRef<((html: string | null) => void) | null>(null);
    const webview = useRef<any>(null);
    const corsProxy = Config.corsProxy;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useImperativeHandle(
      fetchHandle,
      () => ({
        processUrl: (url) => {
          return new Promise((resolve) => {
            setSource(url);
            let resolved = false;
            htmlHandler.current = (html) => {
              if (resolved) return;
              resolved = true;
              setSource(null);
              resolve(html);
            };
            loadHandler.current = (result) => {
              if (resolved) return;
              if (!result) {
                resolved = true;
                setSource(null);
                resolve(null);
                return;
              }
            };
          });
        }
      }),
      []
    );

    useEffect(() => {
      (async () => {
        const user = await db.user.getUser();
        setIsLoggedIn(!!user);
        const clipperPath =
          Platform.OS === "ios"
            ? RNFetchBlob.fs.dirs.MainBundleDir +
              "/extension.bundle/clipper.bundle.js"
            : "bundle-assets://clipper.bundle.js";

        RNFetchBlob.fs
          .readFile(clipperPath, "utf8")
          .then((clipper) => {
            setClipper(clipper);
          })
          .catch((e) => console.log(e));
      })();
    }, []);

    return !source || !clipper ? null : (
      <WebView
        ref={webview}
        onLoad={() => {
          loadHandler.current?.(true);
        }}
        style={{
          width: 100,
          height: 100,
          position: "absolute",
          opacity: 0,
          zIndex: -1,
          pointerEvents: "none"
        }}
        useSharedProcessPool={false}
        pointerEvents="none"
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data && data.type === "html") {
              console.log("message recieved page loaded");
              htmlHandler.current?.(data.value);
            } else {
              if (data.type === "error") {
                console.log("error", data.value);
                htmlHandler.current?.(null);
              }
            }
          } catch (e) {
            console.log("Error handling webview message", e);
          }
        }}
        injectedJavaScriptBeforeContentLoaded={script(
          clipper,
          corsProxy,
          isLoggedIn
        )}
        onError={() => {
          console.log("Error loading page");
          loadHandler.current?.();
        }}
        source={{
          uri: source
        }}
      />
    );
  },
  () => true
);

const script = (
  clipper: string,
  corsProxy: string | undefined,
  loggedIn: boolean
) => `
globalThis.module = {};
${clipper}


function postMessage(type, value) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: type,
        value: value
      })
    );
  }
}

(() => {
  try {
    const loadFn = () => {
      if (!globalThis.Clipper.clipPage) {
        postMessage("error", globalThis.Clipper.clipPage);
      } else {
        globalThis.Clipper.clipPage(document,false, {
          images: ${loggedIn ? "true" : "false"},
          inlineImages: false,
          styles: false,
          corsProxy: ${corsProxy ? `"${corsProxy}"` : "undefined"}
        }).then(result => {
          postMessage("html", result);
        }).catch(e => {
          postMessage("error");
        });
      }
    };
    window.addEventListener("load",loadFn, false);
  } catch(e) {
    postMessage("error", e.message);
  } 
})();


`;

HtmlLoadingWebViewAgent.displayName = "HtmlLoadingWebViewAgent";
