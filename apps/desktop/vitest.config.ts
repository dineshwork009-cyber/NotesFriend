import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 120 * 1000,
    hookTimeout: 120 * 1000,
    sequence: {
      concurrent: true,
      shuffle: true
    },
    globalSetup: "./__tests__/global-setup.ts",
    dir: "./__tests__/",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/test-results/**",
      "**/test-artifacts/**"
    ]
  }
});
