import { defineConfig } from "@rsbuild/core";
import path from "path";

export default defineConfig({
  source: {
    entry: {
      global: "./dist/index.global.js"
    }
  },
  mode: "production",
  output: {
    target: "node",
    cleanDistPath: false,
    filename: {
      js: "clipper.bundle.js"
    },
    distPath: {
      root: path.resolve(__dirname, "../../apps/mobile/ios/extension.bundle")
    }
  }
});
