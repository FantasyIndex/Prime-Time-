import { execSync } from "child_process";
import { cpSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

process.env.BASE_PATH = "/";

console.log("Building prime-time-sports...");
execSync("pnpm --filter @workspace/prime-time-sports run build", {
  stdio: "inherit",
});

const outputDir = resolve(".vercel/output");
mkdirSync(`${outputDir}/static`, { recursive: true });

console.log("Copying to Vercel output...");
cpSync("artifacts/prime-time-sports/dist/public", `${outputDir}/static`, {
  recursive: true,
});

writeFileSync(
  `${outputDir}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2
  )
);

console.log("Done — Vercel output ready.");
