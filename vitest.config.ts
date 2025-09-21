import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["e2e", "node_modules"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["integration-tests/**/*.test.ts"],
          setupFiles: ["./integration-tests/setup.ts"],
        },
      },
    ],
  },

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
