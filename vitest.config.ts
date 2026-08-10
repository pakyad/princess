import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: { environment: "jsdom", coverage: { provider: "v8", include: ["lib/game/reducer.ts"], thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 } } },
});
