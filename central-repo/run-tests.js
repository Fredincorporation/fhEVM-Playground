#!/usr/bin/env node

import { spawn } from "child_process";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  const testFiles = await glob("examples/*/test/*.test.ts", {
    cwd: __dirname,
    absolute: false,
  });

  console.log(`Found ${testFiles.length} test files:\n`);

  for (const testFile of testFiles.sort()) {
    const example = testFile.split("/")[1];
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Running tests for: ${example}`);
    console.log(`${"=".repeat(60)}\n`);

    await new Promise((resolve, reject) => {
      const mocha = spawn("npx", ["mocha", "--require", "ts-node/register", testFile], {
        cwd: __dirname,
        stdio: "inherit",
      });

      mocha.on("close", (code) => {
        if (code !== 0 && code !== null) {
          console.error(`Test failed with exit code ${code}`);
        }
        resolve();
      });

      mocha.on("error", (err) => {
        console.error(`Error running tests: ${err.message}`);
        resolve();
      });
    });
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("All tests completed");
  console.log(`${"=".repeat(60)}\n`);
}

runTests().catch(console.error);
