import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import autoprefixer from "autoprefixer";
import { version } from "./package.json";
import envCompatible from "vite-plugin-env-compatible";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
    minify: "esbuild",
    cssMinify: true,
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash:12][extname]",
        chunkFileNames: "assets/[name]-[hash:12].js"
      }
    }
  },
  define: {
    APP_VERSION: `"${version}"`
  },
  logLevel: process.env.NODE_ENV === "production" ? "warn" : "info",
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react"]
  },
  server: {
    port: 3000
  },
  worker: {
    format: "es"
  },
  css: {
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  plugins: [
    react(),
    envCompatible({
      prefix: "NN_",
      mountedPath: "process.env"
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        namedExport: "ReactComponent"
        // ...svgr options (https://react-svgr.com/docs/options/)
      }
    })
  ]
});
