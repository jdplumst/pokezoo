import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		exclude: ["e2e", "node_modules"],
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					include: ["src/**/*.test.ts", "tests/unit-tests/**/*.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "integration",
					include: ["tests/integration-tests/**/*.test.ts"],
					globalSetup: "./tests/integration-tests/setup.ts",
					maxWorkers: 1,
					isolate: true,
					pool: "threads",
					sequence: {
						concurrent: false,
						hooks: "stack",
						shuffle: false,
					},
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
