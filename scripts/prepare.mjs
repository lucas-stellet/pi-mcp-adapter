import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const omit = String(process.env.npm_config_omit ?? "");
const production = process.env.npm_config_production === "true";
if (omit.split(",").includes("dev") || production) {
  console.log("skipping public build (production / omit=dev install)");
  process.exit(0);
}

const require = createRequire(import.meta.url);
try {
  require.resolve("typescript/package.json");
  require.resolve("@types/node/package.json");
} catch {
  console.log("skipping public build (devDependencies not installed)");
  process.exit(0);
}

const result = spawnSync("npm", ["run", "build:public"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
