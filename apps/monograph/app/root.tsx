import "./root.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { BaseThemeProvider } from "./components/theme-provider";
import { Buffer } from "buffer";
import { ThemeDark, themeToCSS } from "@notesfriend/theme";
import { LoaderFunction } from "@remix-run/node";

globalThis.Buffer = Buffer;

type RootLoaderData = { cspScriptNonce: string };
export const loader: LoaderFunction = async () => {
  const crypto = await import("node:crypto");
  return { cspScriptNonce: crypto.randomBytes(16).toString("hex") };
};

export function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <Meta />
      <Links />
      <style
        id="theme-colors"
        dangerouslySetInnerHTML={{ __html: themeToCSS(ThemeDark) }}
      />
    </>
  );
}

export default function App() {
  const data = useLoaderData<RootLoaderData>();
  const cspScriptNonce =
    typeof document === "undefined" ? data.cspScriptNonce : "";

  return (
    <>
      <BaseThemeProvider
        injectCssVars
        colorScheme="dark"
        sx={{ bg: "background" }}
      >
        <Outlet />
      </BaseThemeProvider>
      <ScrollRestoration nonce={cspScriptNonce} />
      <Scripts nonce={cspScriptNonce} />
    </>
  );
}
