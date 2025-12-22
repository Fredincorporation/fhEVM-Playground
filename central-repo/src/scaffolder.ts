import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { CATEGORIES } from './templates-index.js';

// Map category IDs to their actual example directory names
const CATEGORY_TO_EXAMPLE_DIR: Record<string, string> = {
  'basic-counter': 'basic-counter',
  'arithmetic': 'arithmetic',
  'comparisons': 'comparisons',
  'single-encryption': 'single-encryption',
  'multiple-encryption': 'private-erc20',
  'single-decryption-user': 'public-encryption',
  'single-decryption-public': 'public-encryption',
  'multiple-decryption': 'private-erc20',
  'access-control': 'access-control',
  'input-verification-proofs': 'input-proofs',
  'anti-patterns-guide': 'anti-patterns',
  'handles-lifecycle': 'handles-lifecycle',
  'oz-erc20-wrapper': 'private-erc20',
  'oz-erc7984-basic': 'erc7984',
  'swaps': 'swaps',
  'vesting': 'vesting',
  'blind-auction': 'blind-auction',
  'dao-voting-pro': 'dao-voting',
  'private-lending-pro': 'private-lending',
  'blind-dex-pro': 'blind-dex',
  'poker-game-pro': 'encrypted-poker',
  'yield-farming-pro': 'private-yield',
  'mev-arbitrage-pro': 'mev-arbitrage',
  'confidential-stablecoin-pro': 'confidential-stablecoin',
};

export interface ScaffoldOptions {
  name: string;
  category: string;
  isPro: boolean;
}

/**
 * Main scaffolding function
 * Creates a new fhEVM example project with all necessary files and structure
 */
export async function createExample(options: ScaffoldOptions): Promise<void> {
  const projectDir = path.resolve(process.cwd(), options.name);
  const categoryData = CATEGORIES.find((cat: any) => cat.id === options.category);

  if (!categoryData) {
    throw new Error(`Unknown category: ${options.category}`);
  }

  if (categoryData.isPro && !options.isPro) {
    throw new Error(`Category "${options.category}" requires --pro flag`);
  }

  // Check if directory exists
  if (fs.existsSync(projectDir)) {
    throw new Error(`Directory "${options.name}" already exists`);
  }

  console.log(chalk.blue(`📁 Creating project structure...`));
  
  // Create base directory structure
  fs.ensureDirSync(projectDir);
  fs.ensureDirSync(path.join(projectDir, 'contracts'));
  fs.ensureDirSync(path.join(projectDir, 'test'));
  fs.ensureDirSync(path.join(projectDir, 'hardhat'));

  // Create package.json
  console.log(chalk.blue(`📦 Setting up package.json...`));
  const packageJson = {
    name: options.name,
    version: '1.0.0',
    description: `${categoryData.name} - fhEVM example`,
    main: 'index.js',
    scripts: {
      test: 'hardhat test',
      compile: 'hardhat compile',
      deploy: 'hardhat run scripts/deploy.ts',
      coverage: 'hardhat coverage',
    },
    keywords: ['fhEVM', 'FHE', categoryData.name.toLowerCase()],
    author: '',
    license: 'MIT',
    dependencies: {
      'fhevm': '^0.6.0',
      'ethers': '^6.10.0',
    },
    devDependencies: {
      '@nomicfoundation/hardhat-chai-matchers': '^2.0.0',
      '@nomicfoundation/hardhat-toolbox': '^4.0.0',
      '@types/chai': '^4.3.11',
      '@types/mocha': '^10.0.6',
      '@types/node': '^20.10.6',
      'chai': '^4.3.10',
      'hardhat': '^2.19.4',
      'mocha': '^10.2.0',
      'solc': '^0.8.24',
      'ts-node': '^10.9.2',
      'typescript': '^5.3.3',
    },
  };

  fs.writeJsonSync(path.join(projectDir, 'package.json'), packageJson, { spaces: 2 });

  // Create hardhat.config.ts
  console.log(chalk.blue(`⚙️  Creating hardhat configuration...`));
  createHardhatConfig(projectDir);

  // Create tsconfig.json
  console.log(chalk.blue(`⚙️  Creating TypeScript configuration...`));
  createTsConfig(projectDir);

  // Copy contract and test files from examples
  console.log(chalk.blue(`🔒 Copying contract templates...`));
  // In ESM, reconstruct __dirname from import.meta.url
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Map category ID to actual example directory name
  const exampleDirName = CATEGORY_TO_EXAMPLE_DIR[options.category] || options.category;
  const exampleDir = path.resolve(__dirname, '..', '..', 'examples', `${exampleDirName}-premium`);
  
  // Convert example dir name to PascalCase for contract file naming
  // Uses a comprehensive mapping to handle special cases correctly
  const contractNameMap: Record<string, string> = {
    'access-control': 'AccessControl',
    'anti-patterns': 'AntiPatterns',
    'arithmetic': 'Arithmetic',
    'basic-counter': 'BasicCounter',
    'blind-auction': 'BlindAuction',
    'blind-dex': 'BlindDEX',
    'comparisons': 'Comparisons',
    'confidential-stablecoin': 'ConfidentialStablecoin',
    'dao-voting': 'DAOVoting',
    'encrypted-poker': 'EncryptedPoker',
    'erc7984': 'ERC7984',
    'handles-lifecycle': 'HandlesLifecycle',
    'input-proofs': 'InputProofs',
    'mev-arbitrage': 'MEVArbitrage',
    'private-erc20': 'PrivateERC20',
    'private-lending': 'PrivateLending',
    'private-yield': 'PrivateYield',
    'public-encryption': 'PublicEncryption',
    'single-encryption': 'SingleEncryption',
    'swaps': 'Swaps',
    'vesting': 'Vesting',
  };
  
  const contractNameFromDir = contractNameMap[exampleDirName] || 
    exampleDirName
      .split('-')
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  
  // Contract files use format: {ContractName}Premium.sol
  // Test files use format: {example-dir-name}-premium.test.ts
  const contractFileName = `${contractNameFromDir}Premium.sol`;
  const testFileName = `${exampleDirName}-premium.test.ts`;
  const contractSrcPath = path.join(exampleDir, 'contracts', contractFileName);
  const testSrcPath = path.join(exampleDir, 'test', testFileName);
  const readmeSrcPath = path.join(exampleDir, 'README.md');

  const contractPath = path.join(projectDir, 'contracts', `${categoryData.contractName}.sol`);
  const testPath = path.join(projectDir, 'test', `${categoryData.contractName}.test.ts`);

  if (fs.existsSync(contractSrcPath)) {
    fs.copyFileSync(contractSrcPath, contractPath);
  } else {
    console.warn(chalk.yellow(`⚠️  Contract template not found at ${contractSrcPath}`));
  }

  if (fs.existsSync(testSrcPath)) {
    fs.copyFileSync(testSrcPath, testPath);
    
    // Fix import paths in test file for standalone projects
    let testContent = fs.readFileSync(testPath, 'utf-8');
    testContent = testContent.replace(
      /import\s+{([^}]+)}\s+from\s+"\.\.\/\.\.\/\.\.\/\.\.\/scripts\/test-helpers"/,
      'import { $1 } from "./test-helpers.js"'
    );
    fs.writeFileSync(testPath, testContent);
  } else {
    console.warn(chalk.yellow(`⚠️  Test template not found at ${testSrcPath}`));
  }

  // Create test-helpers file (as .js for compatibility with ESM)
  const testHelpersPath = path.join(projectDir, 'test', 'test-helpers.js');
  const testHelpersContent = `export async function initGateway() {
  // Placeholder for gateway initialization
  // In a real setup, this would initialize the FHE gateway
  console.log('Gateway initialized');
}

export async function getSignatureAndEncryption(data) {
  // Placeholder for signature and encryption
  // In a real setup, this would handle cryptographic operations with actual FHE
  // For testing purposes, return dummy encrypted values
  return {
    ciphertext: '0x0000000000000000000000000000000000000000000000000000000000000000',
    signature: '0x0000000000000000000000000000000000000000000000000000000000000000',
    encryption: '0x0000000000000000000000000000000000000000000000000000000000000000'
  };
}
`;
  fs.writeFileSync(testHelpersPath, testHelpersContent);

  // Copy or generate README
  console.log(chalk.blue(`📚 Creating README...`));
  let readmeContent: string;
  if (fs.existsSync(readmeSrcPath)) {
    readmeContent = fs.readFileSync(readmeSrcPath, 'utf-8');
  } else {
    readmeContent = `# ${categoryData.name}\n\nfhEVM example for ${categoryData.name}`;
  }
  fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);

  // Create .env.example
  fs.writeFileSync(
    path.join(projectDir, '.env.example'),
    'SEPOLIA_PRIVATE_KEY=\nEVMOS_TESTNET_PRIVATE_KEY=\n'
  );

  // Create .gitignore
  fs.writeFileSync(
    path.join(projectDir, '.gitignore'),
    'node_modules/\ndist/\nbuild/\n.env\n.env.local\n*.log\n.DS_Store\n'
  );

  // Initialize git
  console.log(chalk.blue(`🔗 Initializing git repository...`));
  try {
    execSync('git init', { cwd: projectDir, stdio: 'ignore' });
    execSync('git add .', { cwd: projectDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit: fhEVM Playground Pro example"', {
      cwd: projectDir,
      stdio: 'ignore',
    });
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Git initialization skipped (git not available)'));
  }

  console.log(chalk.green(`✅ Project structure created!`));
  console.log(chalk.cyan(`\n📖 Documentation:`));
  console.log(chalk.white(`   Category: ${categoryData.name}`));
  console.log(chalk.white(`   Complexity: ${categoryData.complexity}`));
  console.log(chalk.white(`   Location: ${projectDir}\n`));
}

/**
 * Create hardhat.config.ts with FHE network configuration
 */
function createHardhatConfig(projectDir: string): void {
  const config = `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC || "https://sepolia.infura.io/v3/",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./artifacts",
  },
};

export default config;
`;

  fs.writeFileSync(path.join(projectDir, 'hardhat.config.ts'), config);
}

function createTsConfig(projectDir: string): void {
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      lib: ['ES2020'],
      moduleResolution: 'node',
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: './dist',
      rootDir: './',
      resolveJsonModule: true,
      allowJs: true,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ['**/*.ts'],
    exclude: ['node_modules', 'dist'],
  };

  fs.writeJsonSync(path.join(projectDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
}
