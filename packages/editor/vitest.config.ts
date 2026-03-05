import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { mainFields: ["module", "jsnext:main", "jsnext"] },
  test: {
    alias: {
      "@/": "./"
    },
    environment: "happy-dom",
    typecheck: {
      tsconfig: "./tsconfig.tests.json"
    }
  }
});
