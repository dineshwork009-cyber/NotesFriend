import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import ThemeDark from "@notesfriend/theme/theme-engine/themes/default-dark.json" with { type:"json" };
import type { Plugin, ResolvedConfig } from "vite";
import { writeFile } from "fs/promises";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as pkg from "./package.json";

const DEDUPE = [
  "react",
  "react-dom",
  "@mdi/js",
  "@mdi/react",
  "@emotion/react",
  "zustand",
  "@theme-ui/core",
  "@theme-ui/components"
];
const DEFAULT_THEME_KEY =
  process.env.NODE_ENV === "development"
    ? "globalThis.DEFAULT_THEME"
    : "globalThis.DEFAULT_THEME";
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    writePlugin({
      "../package.json": JSON.stringify({
        name: pkg.name,
        version: pkg.version,
        type: "module",
        scripts: { start: pkg.scripts.start },
        dependencies: {
          "@napi-rs/canvas": pkg.dependencies["@napi-rs/canvas"],
          "@remix-run/server-runtime":
            pkg.devDependencies["@remix-run/server-runtime"]
        }
      })
    }),
    remix({
      buildDirectory: "output/build",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths(),
    arraybuffer(),
    isSsrBuild
      ? viteStaticCopy({
          targets: [
            { src: "./server.ts", dest: "../../" },
            { src: "./app/assets", dest: "../" },
            { src: "./fonts", dest: "../" }
          ]
        })
      : undefined
  ],
  worker: {
    format: "es",
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  },
  ssr: {
    ...(process.env.NODE_ENV === "development"
      ? {}
      : { noExternal: true, external: ["@napi-rs/canvas"] }),
    target: "node"
  },
  build: {
    target: isSsrBuild ? "node20" : undefined,
    rollupOptions: {
      external: ["@napi-rs/canvas"],
    }
  },
  define: {
    [DEFAULT_THEME_KEY]: JSON.stringify(ThemeDark)
  },
  resolve: {
    dedupe: DEDUPE
  }
}));

function writePlugin(files: Record<string, string>): Plugin {
  let config: ResolvedConfig;
  let output = false;

  return {
    name: "vite-plugin-static-copy:build",
    apply: "build",
    configResolved(_config) {
      config = _config;
    },
    buildEnd() {
      output = false;
    },
    async writeBundle() {
      if (output) return;
      for (const file in files) {
        const content = files[file];
        await writeFile(path.join(config.build.outDir, "..", file), content);
      }
    }
  };
}
