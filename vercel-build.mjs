import { execSync } from "child_process";
import { cpSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

// 1. Ensure pnpm is available
console.log("=== Checking pnpm ===");
try {
  run("pnpm --version");
} catch {
  console.log("pnpm not found — installing via npm...");
  run("npm install -g pnpm@10.26.1");
}

// 2. Install dependencies from monorepo root
console.log("\n=== Installing dependencies ===");
run("pnpm install --frozen-lockfile");

// 3. Build the app
console.log("\n=== Building prime-time-sports ===");
process.env.BASE_PATH = "/";
run("pnpm --filter @workspace/prime-time-sports run build");

// 4. Verify output exists
const builtDir = resolve("artifacts/prime-time-sports/dist/public");
if (!existsSync(builtDir)) {
  console.error("Build output not found at:", builtDir);
  process.exit(1);
}

// 5. Write Vercel output
console.log("\n=== Writing Vercel output ===");
const outputDir = resolve(".vercel/output");
mkdirSync(`${outputDir}/static`, { recursive: true });

cpSync(builtDir, `${outputDir}/static`, { recursive: true });

writeFileSync(
  `${outputDir}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/api/(.*)", dest: "/api/$1" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2
  )
);

console.log("\n✓ Done — Vercel output ready.");
