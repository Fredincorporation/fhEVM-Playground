import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { CATEGORIES, getContractTemplate, getTestTemplate, getReadmeTemplate } from './templates-index';
import { generateDocumentation } from './doc-generator';

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
  const categoryData = CATEGORIES.find(cat => cat.id === options.category);

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
      '@zama.ai/fhevm': '^0.9.0',
      'ethers': '^6.10.0',
    },
    devDependencies: {
      '@types/chai': '^4.3.11',
      '@types/mocha': '^10.0.6',
      '@types/node': '^20.10.6',
      'chai': '^4.3.10',
      'hardhat': '^2.19.4',
      'hardhat-chai-matchers': '^1.0.6',
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

  // Create contract and test files
  console.log(chalk.blue(`🔒 Generating contract templates...`));
  const contractTemplate = getContractTemplate(options.category);
  const testTemplate = getTestTemplate(options.category);

  const contractPath = path.join(projectDir, 'contracts', `${categoryData.contractName}.sol`);
  const testPath = path.join(projectDir, 'test', `${categoryData.contractName}.test.ts`);

  fs.writeFileSync(contractPath, contractTemplate);
  fs.writeFileSync(testPath, testTemplate);

  // Create README
  console.log(chalk.blue(`📚 Generating README...`));
  const readmeContent = getReadmeTemplate(options.category, categoryData);
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
