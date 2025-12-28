/**
 * Scaffolder that copies actual example contracts/tests from central-repo/examples/
 * Falls back to base-template for npm published users who don't have access to central repo.
 */
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Category ID to example directory name mapping
// Supports both short names (e.g., 'blind-dex') and full category keys (e.g., 'blind-dex-pro')
const CATEGORY_TO_EXAMPLE_DIR: Record<string, string> = {
  // Full official category names
  'basic-counter': 'basic-counter',
  'arithmetic': 'arithmetic',
  'comparisons': 'comparisons',
  'single-encryption': 'single-encryption',
  'access-control': 'access-control',
  'input-verification-proofs': 'input-proofs',
  'anti-patterns-guide': 'anti-patterns',
  'handles-lifecycle': 'handles-lifecycle',
  'oz-erc7984-basic': 'erc7984',
  'oz-erc20-wrapper': 'private-erc20',
  'vesting': 'vesting',
  'blind-auction': 'blind-auction',
  'dao-voting-pro': 'dao-voting',
  'private-lending-pro': 'private-lending',
  'blind-dex-pro': 'blind-dex',
  'poker-game-pro': 'encrypted-poker',
  'yield-farming-pro': 'private-yield',
  'mev-arbitrage-pro': 'mev-arbitrage',
  'confidential-stablecoin-pro': 'confidential-stablecoin',
  // Aliases: short names matching example directory prefixes for better UX
  'anti-patterns': 'anti-patterns',
  'blind-dex': 'blind-dex',
  'confidential-stablecoin': 'confidential-stablecoin',
  'dao-voting': 'dao-voting',
  'encrypted-poker': 'encrypted-poker',
  'erc7984': 'erc7984',
  'input-proofs': 'input-proofs',
  'mev-arbitrage': 'mev-arbitrage',
  'private-erc20': 'private-erc20',
  'private-lending': 'private-lending',
  'private-yield': 'private-yield',
  'yield-farming': 'private-yield', // alias for yield-farming-pro
};

export interface ScaffoldOptions {
  name: string;
  category: string;
  isPro: boolean;
}

export async function createExample(options: ScaffoldOptions): Promise<void> {
  const projectDir = path.resolve(process.cwd(), options.name);
  if (fs.existsSync(projectDir)) {
    throw new Error(`Directory ${options.name} already exists`);
  }

  // Always start with base-template for full Hardhat setup
  const baseTemplate = path.resolve(__dirname, '..', 'base-template');
  if (!fs.existsSync(baseTemplate)) {
    throw new Error('base-template not found in package. Ensure base-template/ is published.');
  }
  fs.copySync(baseTemplate, projectDir);

  // Try to find and overlay the actual example's contracts/tests
  const exampleDirName = CATEGORY_TO_EXAMPLE_DIR[options.category] || options.category;
  
  // Build a list of candidate search paths. Prefer paths relative to the
  // installed package (`__dirname`) first, then fall back to the current
  // working directory and its parents (for development runs).
  const searchPaths: string[] = [];

  // First, search in the bundled templates directory (for npm published users)
  searchPaths.push(path.join(__dirname, '..', 'templates', `${exampleDirName}-premium`));

  // Search upward from __dirname (package location)
  let dir = path.resolve(__dirname);
  for (let i = 0; i < 5; i++) {
    searchPaths.push(path.join(dir, 'central-repo', 'examples', `${exampleDirName}-premium`));
    dir = path.resolve(dir, '..');
  }

  // Also search upward from process.cwd()
  dir = path.resolve(process.cwd());
  for (let i = 0; i < 5; i++) {
    searchPaths.push(path.join(dir, 'central-repo', 'examples', `${exampleDirName}-premium`));
    dir = path.resolve(dir, '..');
  }

  // Check common development locations (for developers working locally)
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  if (homeDir) {
    searchPaths.push(path.join(homeDir, 'Documents', 'GitHub', 'fhEVM Playground', 'central-repo', 'examples', `${exampleDirName}-premium`));
    searchPaths.push(path.join(homeDir, 'projects', 'fhEVM Playground', 'central-repo', 'examples', `${exampleDirName}-premium`));
    searchPaths.push(path.join(homeDir, 'work', 'fhEVM Playground', 'central-repo', 'examples', `${exampleDirName}-premium`));
  }

  let centralRepoExampleDir: string | null = null;
  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      centralRepoExampleDir = searchPath;
      console.log(chalk.green(`Found central-repo example at ${searchPath}`));
      break;
    }
  }

  if (!centralRepoExampleDir) {
    console.log(chalk.yellow(`Example ${exampleDirName}-premium not found in any of these locations:`));
    // Show a few of the paths we tried (first 8)
    for (const p of searchPaths.slice(0, 8)) {
      console.log(chalk.gray(`  - ${p}`));
    }
  }

  if (centralRepoExampleDir) {
    // Overlay contracts, tests, fhevm lib, and scripts from the real example
    const contractsSrc = path.join(centralRepoExampleDir, 'contracts');
    const contractsDest = path.join(projectDir, 'contracts');
    const testSrc = path.join(centralRepoExampleDir, 'test');
    const testDest = path.join(projectDir, 'test');
    const fhevmSrc = path.join(centralRepoExampleDir, 'fhevm');
    const fhevmDest = path.join(projectDir, 'fhevm');
    const scriptsSrc = path.join(centralRepoExampleDir, 'scripts');
    const scriptsDest = path.join(projectDir, 'scripts');

    if (fs.existsSync(contractsSrc)) {
      fs.copySync(contractsSrc, contractsDest, { overwrite: true });
      console.log(chalk.cyan(`Overlaid contracts from ${exampleDirName}-premium`));
    }
    if (fs.existsSync(fhevmSrc)) {
      fs.copySync(fhevmSrc, fhevmDest, { overwrite: true });
      console.log(chalk.cyan(`Overlaid fhevm library from ${exampleDirName}-premium`));
    }
    if (fs.existsSync(scriptsSrc)) {
      fs.copySync(scriptsSrc, scriptsDest, { overwrite: true });
      console.log(chalk.cyan(`Overlaid scripts from ${exampleDirName}-premium`));
    }
    if (fs.existsSync(testSrc)) {
      // Remove base-template placeholder tests before overlaying
      const exampleTestPath = path.join(testDest, 'example.test.ts');
      if (fs.existsSync(exampleTestPath)) {
        fs.removeSync(exampleTestPath);
      }
      
      fs.copySync(testSrc, testDest, { overwrite: true });
      console.log(chalk.cyan(`Overlaid tests from ${exampleDirName}-premium`));
      
      // Fix import paths in test files for standalone projects
      const testFiles = fs.readdirSync(testDest).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
      for (const testFile of testFiles) {
        const testPath = path.join(testDest, testFile);
        let testContent = fs.readFileSync(testPath, 'utf-8');
        
        // Replace absolute paths: ../../../../scripts/test-helpers -> ./test-helpers.js
        testContent = testContent.replace(
          /import\s+{([^}]+)}\s+from\s+"\.\.\/\.\.\/\.\.\/\.\.\/scripts\/test-helpers"/,
          'import { $1 } from "./test-helpers.js"'
        );
        
        // Replace imports: import { ethers } from "ethers" -> use `hre.ethers`
        // Remove the direct ethers import (we'll provide an adapter below)
        testContent = testContent.replace(/import\s*{\s*ethers\s*}\s*from\s*["']ethers["']\s*;?\n/g, '');

        // Ensure tests use hre.ethers where appropriate and provide a local `ethers` alias
        // Replace ethers.getSigners() etc with hre.ethers.* so calls using hre work
        testContent = testContent.replace(/ethers\.getSigners/g, 'hre.ethers.getSigners');
        testContent = testContent.replace(/ethers\.getContractFactory/g, 'hre.ethers.getContractFactory');
        testContent = testContent.replace(/ethers\.provider/g, 'hre.ethers.provider');

        // Don't create a top-level ethers alias (may be uninitialized). Instead,
        // ensure an `ethers` alias is created inside `beforeEach` after initGateway.
        // We'll inject a local alias after `await initGateway();` when present.
        // Use an outer-scope `let ethers` declaration so tests can access it across hooks.
        testContent = testContent.replace(/(import\s+\{[^}]+\}\s+from\s+["']\.\.\/scripts\/test-helpers\.ts["'];?\n)/, '$1let ethers: any;\n');
        testContent = testContent.replace(/await initGateway\(\);\s*/g, 'await initGateway();\n    if (hre && hre.ethers && hre.ethers.utils) {\n      ethers = hre.ethers;\n    } else {\n      const imported = await import("ethers");\n      ethers = imported.ethers || imported;\n    }\n');
        
        // Remove explicit hardhat ethers import if present (we use the hre import + alias)
        testContent = testContent.replace(/import\s*{\s*ethers\s*}\s*from\s*["']hardhat["']\s*;?\n/g, '');

        // Allow revert message flexiblity: some compiled helpers include extended text
        // Replace exact revertWith string checks for the anti-pattern message with a regex
        testContent = testContent.replace(/\.to\.be\.revertedWith\(\s*["']Do not decrypt on-chain["']\s*\)/g, '.to.be.revertedWith(/Do not decrypt on-chain/)');

        // Provide fallbacks for ethers.utils.hexlify/toUtf8Bytes and ethers.BigNumber
        // Some examples call `ethers.utils.hexlify(ethers.utils.toUtf8Bytes("..."))`
        // and `ethers.BigNumber.from(...)`. Create a local utf8Hex helper and
        // relax BigNumber expectations to string comparisons when needed.
        if (/ethers\.utils\.hexlify/.test(testContent)) {
          // insert utf8Hex helper near the top (after imports)
          testContent = testContent.replace(/(import[\s\S]*?;\n)(?=\n|describe|let)/, `$1const utf8Hex = (s) => '0x' + Array.from(unescape(encodeURIComponent(s))).map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join('');\n`);
          // replace common pattern
          testContent = testContent.replace(/ethers\.utils\.hexlify\(\s*ethers\.utils\.toUtf8Bytes\(([^)]+)\)\s*\)/g, 'utf8Hex($1)');
        }

        // Replace BigNumber equality expectations with string-based comparison
        testContent = testContent.replace(/expect\(sum\)\.to\.equal\(ethers\.BigNumber\.from\(([^)]+)\)\);/g, 'expect(sum.toString()).to.equal(String($1));');
        
        fs.writeFileSync(testPath, testContent);
      }
      
      // Ensure `scripts/test-helpers.ts` exists so tests importing
      // `../scripts/test-helpers` resolve in the scaffolded project.
      const scriptsDir = path.join(projectDir, 'scripts');
      if (!fs.existsSync(scriptsDir)) {
        fs.mkdirSync(scriptsDir, { recursive: true });
      }
      const scriptHelpersTs = path.join(scriptsDir, 'test-helpers.ts');
      if (!fs.existsSync(scriptHelpersTs)) {
        const helpersTsContent = `export async function initGateway() {
    // stubbed gateway init for scaffolded projects
    return Promise.resolve({ gateway: 'stub' });
  }

  export function getSignatureAndEncryption() {
    return { signature: 'stub-signature', encryption: 'stub-encryption' };
  }

  export function isMockedMode() {
    return true;
  }

  // Normalize BigNumberish values - shared helper for monkeypatches and tests
  const normalizeBigNumberish = (value: any): string => {
    if (typeof value === 'number' || typeof value === 'bigint') {
      const bn = BigInt(value);
      return '0x' + (bn & BigInt('0xffffffff')).toString(16).padStart(8, '0');
    }
    if (typeof value !== 'string') return '0x0';
    
    const m = value.match(/^(0x[0-9a-fA-F]+)-(\\d+)$/);
    if (m) {
      const hex = m[1];
      const dec = BigInt(m[2]);
      const raw = BigInt(hex);
      const width = BigInt((hex.length - 2) * 4);
      const mod = 1n << width;
      let res = raw - dec;
      if (res < 0) res += mod;
      const hexDigits = hex.length - 2;
      let out = res.toString(16).padStart(hexDigits, '0');
      const masked = BigInt('0x' + out) & BigInt('0xffffffff');
      return '0x' + masked.toString(16).padStart(8, '0');
    }
    
    if (value.startsWith('0x')) {
      const hexPart = value.slice(2);
      if (hexPart.length > 8) {
        const bn = BigInt(value);
        return '0x' + (bn & BigInt('0xffffffff')).toString(16).padStart(8, '0');
      }
    }
    
    return value;
  };

  // Export the normalization helper
  export { normalizeBigNumberish };

  const toNumberSafe = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'bigint') return Number(value);
    if (value && typeof value === 'object') {
      if (typeof value.toNumber === 'function') {
        try {
          return value.toNumber();
        } catch (e) {
          // fallthrough
        }
      }
      if (typeof value.toString === 'function') {
        const str = value.toString();
        const num = Number(str);
        if (!isNaN(num)) return num;
      }
      if (value._hex) {
        return Number(value._hex);
      }
    }
    return Number(value);
  };

  export { toNumberSafe };

  // Monkeypatch ethers.Contract.populateTransaction to normalize BigNumberish args
  (() => {
    try {
      const ethers = require('ethers');
      if (ethers && ethers.Contract) {
        const origPopulate = ethers.Contract.prototype.populateTransaction;
        if (origPopulate) {
          ethers.Contract.prototype.populateTransaction = function(...args: any[]) {
            const normalizedArgs = args.map(arg => {
              if (Array.isArray(arg)) {
                return arg.map(a => normalizeBigNumberish(a));
              } else if (typeof arg === 'object' && arg !== null) {
                const result: any = {};
                for (const [k, v] of Object.entries(arg)) {
                  result[k] = normalizeBigNumberish(v);
                }
                return result;
              }
              return normalizeBigNumberish(arg);
            });
            return origPopulate.apply(this, normalizedArgs);
          };
        }
      }
    } catch (_e) {
      // ignore if ethers not available
    }
  })();

  // Monkeypatch ethers.Interface.encodeFunctionData to normalize args
  (() => {
    try {
      const ethers = require('ethers');
      if (ethers && ethers.Interface) {
        const origEncode = ethers.Interface.prototype.encodeFunctionData;
        if (origEncode) {
          ethers.Interface.prototype.encodeFunctionData = function(fragment: any, args?: any[]) {
            const normalizedArgs = args ? args.map(arg => {
              if (Array.isArray(arg)) {
                return arg.map(a => normalizeBigNumberish(a));
              } else if (typeof arg === 'object' && arg !== null && typeof arg !== 'function') {
                const result: any = {};
                for (const [k, v] of Object.entries(arg)) {
                  result[k] = normalizeBigNumberish(v);
                }
                return result;
              }
              return normalizeBigNumberish(arg);
            }) : undefined;
            return origEncode.apply(this, [fragment, normalizedArgs]);
          };
        }
      }
    } catch (_e) {
      // ignore if ethers not available
    }
  })();

  // Provide a resilient ethers adapter for scaffolded projects' tests.
  // This ensures tests that reference a global 'ethers' or call into
  // 'ethers.utils'/'BigNumber' work in both CJS and ESM environments.
  try {
    // Prefer synchronous require (CJS environments used by mocha/hardhat)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const _e = require("ethers");
    if (_e) {
      (globalThis as any).ethers = _e.default || _e;
    }
  } catch (e) {
    // If require fails (rare ESM-only runtime), attempt dynamic import at runtime.
    (async () => {
      try {
        const imported = await import('ethers');
        (globalThis as any).ethers = imported.default || imported.ethers || imported;
      } catch (_) {
        // ignore — tests that require ethers will fallback to hre.ethers where available
      }
    })();
  }

  // If Hardhat's 'hre' is available at module evaluation time, prefer its ethers
  // (this keeps compatibility with tests that expect 'hre.ethers' as the authority).
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const _hardhat = require('hardhat');
    if (_hardhat && _hardhat.ethers) {
      (globalThis as any).ethers = _hardhat.ethers;
    }
  } catch (e) {
    // ignore
  }
  `;
        fs.writeFileSync(scriptHelpersTs, helpersTsContent, 'utf-8');
        console.log(chalk.gray('Added scripts/test-helpers.ts stub to scaffold'));
      }
        else {
          // If the example already provides test-helpers.ts, ensure it contains
          // normalization helpers and a resilient ethers adapter so tests work
          // in the scaffolded project.
          try {
            let existing = fs.readFileSync(scriptHelpersTs, 'utf-8');
            let needsUpdate = false;

            // Ensure normalizeBigNumberish is present
            if (!/export\s+function\s+normalizeBigNumberish/.test(existing)) {
              const normHelper = `export function normalizeBigNumberish(value: any): string {
    if (typeof value === 'number' || typeof value === 'bigint') {
      const bn = BigInt(value);
      return '0x' + (bn & BigInt('0xffffffff')).toString(16).padStart(8, '0');
    }
    if (typeof value !== 'string') return '0x0';
    const m = value.match(/^(0x[0-9a-fA-F]+)-(\\d+)$/);
    if (m) {
      const hex = m[1];
      const dec = BigInt(m[2]);
      const raw = BigInt(hex);
      const width = BigInt((hex.length - 2) * 4);
      const mod = 1n << width;
      let res = raw - dec;
      if (res < 0) res += mod;
      const hexDigits = hex.length - 2;
      let out = res.toString(16).padStart(hexDigits, '0');
      const masked = BigInt('0x' + out) & BigInt('0xffffffff');
      return '0x' + masked.toString(16).padStart(8, '0');
    }
    if (value.startsWith('0x')) {
      const hexPart = value.slice(2);
      if (hexPart.length > 8) {
        const bn = BigInt(value);
        return '0x' + (bn & BigInt('0xffffffff')).toString(16).padStart(8, '0');
      }
    }
    return value;
  }

  `;
              existing = normHelper + existing;
              needsUpdate = true;
            }

            // Ensure toNumberSafe is present
            if (!/export\s+function\s+toNumberSafe/.test(existing)) {
              const toNumHelper = `export function toNumberSafe(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'bigint') return Number(value);
    if (value && typeof value === 'object') {
      if (typeof value.toNumber === 'function') {
        try {
          return value.toNumber();
        } catch (e) {
          // fallthrough
        }
      }
      if (typeof value.toString === 'function') {
        const str = value.toString();
        const num = Number(str);
        if (!isNaN(num)) return num;
      }
      if (value._hex) {
        return Number(value._hex);
      }
    }
    return Number(value);
  }

  `;
              existing = toNumHelper + existing;
              needsUpdate = true;
            }

            // Ensure ethers monkeypatches are present
            if (!/populateTransaction.*normalizeBigNumberish/.test(existing)) {
              const monkeyPatches = `// Monkeypatch ethers.Contract.populateTransaction to normalize BigNumberish args
(() => {
  try {
    const ethers = require('ethers');
    if (ethers && ethers.Contract) {
      const origPopulate = ethers.Contract.prototype.populateTransaction;
      if (origPopulate) {
        ethers.Contract.prototype.populateTransaction = function(...args: any[]) {
          const normalizedArgs = args.map(arg => {
            if (Array.isArray(arg)) {
              return arg.map(a => normalizeBigNumberish(a));
            } else if (typeof arg === 'object' && arg !== null) {
              const result: any = {};
              for (const [k, v] of Object.entries(arg)) {
                result[k] = normalizeBigNumberish(v);
              }
              return result;
            }
            return normalizeBigNumberish(arg);
          });
          return origPopulate.apply(this, normalizedArgs);
        };
      }
    }
  } catch (_e) {}
})();

// Monkeypatch ethers.Interface.encodeFunctionData to normalize args
(() => {
  try {
    const ethers = require('ethers');
    if (ethers && ethers.Interface) {
      const origEncode = ethers.Interface.prototype.encodeFunctionData;
      if (origEncode) {
        ethers.Interface.prototype.encodeFunctionData = function(fragment: any, args?: any[]) {
          const normalizedArgs = args ? args.map(arg => {
            if (Array.isArray(arg)) {
              return arg.map(a => normalizeBigNumberish(a));
            } else if (typeof arg === 'object' && arg !== null && typeof arg !== 'function') {
              const result: any = {};
              for (const [k, v] of Object.entries(arg)) {
                result[k] = normalizeBigNumberish(v);
              }
              return result;
            }
            return normalizeBigNumberish(arg);
          }) : undefined;
          return origEncode.apply(this, [fragment, normalizedArgs]);
        };
      }
    }
  } catch (_e) {}
})();

`;
              existing = monkeyPatches + existing;
              needsUpdate = true;
            }

            if (!/globalThis\s*\.\s*ethers/.test(existing)) {
              const adapter = `\n// <-- injected by create-fhevm-playground-pro: ethers adapter -->\ntry {\n  // prefer CJS require for mocha/hardhat environments\n  // eslint-disable-next-line @typescript-eslint/no-var-requires\n  const _e = require('ethers');\n  if (_e) {\n    // Provide compat layer: many examples expect 'ethers.utils.*' and 'ethers.BigNumber'\n    const utils = _e.utils || { hexlify: _e.hexlify, toUtf8Bytes: _e.toUtf8Bytes };\n    const BigNumber = _e.BigNumber || { from: (v) => ({ toString: () => String(v) }) };\n    (globalThis as any).ethers = Object.assign({}, (_e.default || _e), { utils, BigNumber });\n  }\n} catch (e) {\n  (async () => {\n    try { const imported = await import('ethers'); const _x = imported.default || imported.ethers || imported; const utils = _x.utils || { hexlify: _x.hexlify, toUtf8Bytes: _x.toUtf8Bytes }; const BigNumber = _x.BigNumber || { from: (v) => ({ toString: () => String(v) }) }; (globalThis as any).ethers = Object.assign({}, _x, { utils, BigNumber }); } catch(_){}\n  })();\n}\ntry { const _hardhat = require('hardhat'); if (_hardhat && _hardhat.ethers) { (globalThis as any).ethers = _hardhat.ethers; } } catch(e){}\n`;
              existing = adapter + '\n' + existing;
              needsUpdate = true;
            }

            if (needsUpdate) {
              fs.writeFileSync(scriptHelpersTs, existing, 'utf-8');
              console.log(chalk.gray('Injected helpers and ethers adapter into scripts/test-helpers.ts'));
            }
          } catch (err) {
            // ignore read/write errors — best-effort
          }
        }
    }
  } else {
    console.log(chalk.yellow(`Example ${exampleDirName} not found; using base template contracts/tests`));
  }

  // Ensure only hardhat.config.js exists (remove .ts, .cjs variants)
  const hardhatConfigFiles = ['hardhat.config.ts', 'hardhat.config.cjs'];
  for (const configFile of hardhatConfigFiles) {
    const configPath = path.join(projectDir, configFile);
    if (fs.existsSync(configPath)) {
      fs.removeSync(configPath);
    }
  }

  // Update package.json name and description, and add postinstall script
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = options.name;
    pkg.description = `${options.category} - fhEVM example (scaffolded)`;
    // Add postinstall script to inject fhEVM shims after npm install
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts.postinstall = 'node -e "require(\'./scripts/inject-shims.js\')()"';
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }

  // Create scripts/inject-shims.js to run after npm install
  const scriptsDir = path.join(projectDir, 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  const injectShimsPath = path.join(scriptsDir, 'inject-shims.js');
  const injectShimsContent = `const fs = require('fs');
const path = require('path');

module.exports = function() {
  const projectDir = path.dirname(path.dirname(__filename));
  const fhevmDir = path.join(projectDir, 'node_modules', 'fhevm');
  const abstractsDir = path.join(fhevmDir, 'abstracts');
  const libDir = path.join(fhevmDir, 'lib');

  // Create directory structure
  if (!fs.existsSync(abstractsDir)) {
    fs.mkdirSync(abstractsDir, { recursive: true });
  }
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // EIP712WithModifier.sol
  const eip712Content = \`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * Minimal shim of EIP712WithModifier for local compilation/testing only.
 * Provides a constructor and a \\\`onlySignedPublicKey\\\` modifier used by examples.
 */
abstract contract EIP712WithModifier {
    constructor(string memory /*name*/, string memory /*version*/) {}

    modifier onlySignedPublicKey(bytes calldata /*signature*/) {
        _;
    }
}
\`;
  fs.writeFileSync(path.join(abstractsDir, 'EIP712WithModifier.sol'), eip712Content, 'utf-8');

  // Reencrypt.sol
  const reencryptContent = \`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * Minimal Reencrypt shim used by example contracts. In the real fhEVM
 * this contract provides reencryption utilities and modifiers. For local
 * testing we provide a no-op placeholder.
 */
abstract contract Reencrypt {
    // Placeholder hook for reencryption initialization if examples call it
    function _reencryptHook() internal virtual {}
}
\`;
  fs.writeFileSync(path.join(abstractsDir, 'Reencrypt.sol'), reencryptContent, 'utf-8');

  // TFHE.sol
  const tfheContent = \`// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Minimal shim for fhevm TFHE types and functions so examples compile locally.
// Mirrors the \\\`fhEVM\\\` shim but placed at \\\`fhevm/lib/TFHE.sol\\\` to match imports.

type euint32 is uint32;
type ebool is bool;

library TFHE {
    function asEuint32(uint32 x) internal pure returns (euint32) {
        return euint32.wrap(x);
    }

    function add(euint32 a, euint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) + euint32.unwrap(b));
        }
    }

    function add(euint32 a, uint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) + b);
        }
    }

    function sub(euint32 a, euint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) - euint32.unwrap(b));
        }
    }

    function sub(euint32 a, uint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) - b);
        }
    }

    function mul(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) * euint32.unwrap(b));
    }

    function mul(euint32 a, uint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) * b);
    }

    function gt(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) > euint32.unwrap(b));
    }

    function ge(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) >= euint32.unwrap(b));
    }

    function lt(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) < euint32.unwrap(b));
    }

    function le(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) <= euint32.unwrap(b));
    }

    function eq(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) == euint32.unwrap(b));
    }

    function and(ebool a, ebool b) internal pure returns (ebool) {
        return ebool.wrap(ebool.unwrap(a) && ebool.unwrap(b));
    }

    function or(ebool a, ebool b) internal pure returns (ebool) {
        return ebool.wrap(ebool.unwrap(a) || ebool.unwrap(b));
    }

    // Helper for tests: treat encrypted zero as plaintext zero (not secure)
    function isZero(euint32 a) internal pure returns (bool) {
        return euint32.unwrap(a) == 0;
    }

    function select(ebool cond, euint32 a, euint32 b) internal pure returns (euint32) {
        return ebool.unwrap(cond) ? a : b;
    }

    function decrypt(euint32 a) internal pure returns (uint32) {
        return euint32.unwrap(a);
    }
}
\`;
  fs.writeFileSync(path.join(libDir, 'TFHE.sol'), tfheContent, 'utf-8');
};
`;
  fs.writeFileSync(injectShimsPath, injectShimsContent, 'utf-8');

  // Update README to mention category
  const readmePath = path.join(projectDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    let r = fs.readFileSync(readmePath, 'utf-8');
    r = `# ${options.name}\n\nCategory: ${options.category}\n\n` + r;
    fs.writeFileSync(readmePath, r, 'utf-8');
  }

  // Initialize git if available
  try {
    execSync('git init', { cwd: projectDir, stdio: 'ignore' });
    execSync('git add .', { cwd: projectDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit: fhEVM example"', { cwd: projectDir, stdio: 'ignore' });
  } catch (err) {
    // ignore git errors
  }

  console.log(chalk.green(`Project scaffolded at ${projectDir}`));
}
