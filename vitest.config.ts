import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  root: __dirname,
  server: {
    fs: {
      strict: false,
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    server: {
      deps: {
        external: ["zod"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      zod: path.resolve(__dirname, "node_modules/zod/index.js"),
    },
  },
});
