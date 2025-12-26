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
    // Overlay contracts and tests from the real example
    const contractsSrc = path.join(centralRepoExampleDir, 'contracts');
    const contractsDest = path.join(projectDir, 'contracts');
    const testSrc = path.join(centralRepoExampleDir, 'test');
    const testDest = path.join(projectDir, 'test');

    if (fs.existsSync(contractsSrc)) {
      fs.copySync(contractsSrc, contractsDest, { overwrite: true });
      console.log(chalk.cyan(`Overlaid contracts from ${exampleDirName}-premium`));
    }
    if (fs.existsSync(testSrc)) {
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
        
        // Replace hardhat import to work around ESM/CommonJS issues
        // Change: import { ethers } from "hardhat"
        // To: const { ethers } = await import("hardhat")
        // Actually, just remove the import and use globals injected by Hardhat
        testContent = testContent.replace(/import\s*{\s*ethers\s*}\s*from\s*["']hardhat["']\s*;?\n/g, '');
        
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
`;
        fs.writeFileSync(scriptHelpersTs, helpersTsContent, 'utf-8');
        console.log(chalk.gray('Added scripts/test-helpers.ts stub to scaffold'));
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

  // Update package.json name and description
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = options.name;
    pkg.description = `${options.category} - fhEVM example (scaffolded)`;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }

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
