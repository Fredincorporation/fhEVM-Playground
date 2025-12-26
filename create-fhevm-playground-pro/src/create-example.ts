#!/usr/bin/env node
/**
 * CLI entry for create-fhevm-playground-pro
 * Provides `create` and `guided` commands.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createExample } from './scaffolder.js';
import { CATEGORIES } from './templates-index.js';

const program = new Command();

program
  .name('create-fhevm-playground-pro')
  .description('Premium CLI scaffolding tool for fhEVM examples')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new fhEVM example project')
  .requiredOption('-n, --name <name>', 'Project name (e.g., my-counter)')
  .requiredOption('-c, --category <category>', `Category: ${CATEGORIES.map((c: any) => c.id).join(', ')}`)
  .option('-p, --pro', 'Create PRO bonus example (unlocks pro categories)')
  .action(async (options: any) => {
    try {
      console.log(chalk.cyan.bold('\n🚀 fhEVM Playground Pro - Project Generator\n'));

      if (!CATEGORIES.find((cat: any) => cat.id === options.category)) {
        console.error(chalk.red(`❌ Unknown category: ${options.category}`));
        console.log(chalk.yellow(`Available categories:\n${CATEGORIES.map((c: any) => c.id).join(', ')}`));
        process.exit(1);
      }

      const category = CATEGORIES.find((cat: any) => cat.id === options.category);
      if (category?.isPro && !options.pro) {
        console.error(chalk.red(`❌ Category "${options.category}" is PRO only. Add --pro flag.`));
        process.exit(1);
      }

      await createExample({ name: options.name, category: options.category, isPro: !!options.pro });

      console.log(chalk.green.bold('\n✅ Project created successfully!\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.white(`  cd ${options.name}`));
      console.log(chalk.white('  npm install'));
      console.log(chalk.white('  npm run test\n'));
    } catch (error: any) {
      console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`));
      process.exit(1);
    }
  });

// Guided command per specification
program
  .command('guided')
  .description('Interactive guided onboarding for fhEVM Playground Pro')
  .action(async () => {
    try {
      console.clear();
      console.log(chalk.cyan.bold('🔒 Welcome to fhEVM Playground Pro 🔒'));

      // Exact educational paragraph
      console.log(
        chalk.white(
          "Fully Homomorphic Encryption (FHE) enables computation on encrypted data without decryption — a breakthrough for blockchain privacy. Zama's fhEVM brings this power to Ethereum-compatible chains, allowing confidential balances, private voting, blind auctions, MEV-resistant DeFi, and more, all while preserving verifiability. fhEVM Playground Pro is the premium, fully automated example hub built for Zama's December 2025 bounty: 12 core concept examples covering every fundamental + 7 innovative real-world Pro applications in confidential finance, governance, and gaming. Let's dive in and build something private!"
        )
      );

      // Ask which path
      const { pathChoice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'pathChoice',
          message: 'What would you like to explore first?',
          choices: [
            '1. Core Concepts (Master fhEVM fundamentals – 12 examples)',
            '2. Innovative Pro Apps (Real-world confidential apps – 7 examples)'
          ]
        }
      ]);

      const coreList = [
        { title: 'Basic Counter – Encrypted increment & view', id: 'basic-counter' },
        { title: 'Arithmetic Operations – Add, sub, mul on encrypted values', id: 'arithmetic' },
        { title: 'Comparisons & Inequalities – eq, gt, lt on encrypted data', id: 'comparisons' },
        { title: 'Encryption & Decryption – Single/multiple values', id: 'single-encryption' },
        { title: 'Access Control – FHE.allow & allowTransient', id: 'access-control' },
        { title: 'Input Proofs – Why and how to verify client inputs', id: 'input-verification-proofs' },
        { title: 'Anti-Patterns & Edge Cases – Common mistakes to avoid', id: 'anti-patterns-guide' },
        { title: 'Handles & Lifecycle – Symbolic execution and management', id: 'handles-lifecycle' },
        { title: 'OpenZeppelin ERC7984 – Confidential tokens standard', id: 'oz-erc7984-basic' },
        { title: 'OZ Wrappers & Swaps – ERC20 ↔ Confidential conversions', id: 'oz-erc20-wrapper' },
        { title: 'Confidential Vesting Wallet', id: 'vesting' },
        { title: 'Blind Auction Pro – Sealed encrypted bids', id: 'blind-auction' }
      ];

      const proList = [
        { title: 'Confidential DAO Voting – Private votes, homomorphic tally', id: 'dao-voting-pro' },
        { title: 'Private Lending Pool – Encrypted loans & collateral', id: 'private-lending-pro' },
        { title: 'Blind DEX Order Book – MEV-resistant private trades', id: 'blind-dex-pro' },
        { title: 'Encrypted Poker Game – Hidden hands, fair on-chain play', id: 'poker-game-pro' },
        { title: 'Private Yield Farming – Confidential positions & rewards', id: 'yield-farming-pro' },
        { title: 'MEV-Resistant Arbitrage – Blind opportunity execution', id: 'mev-arbitrage-pro' },
        { title: 'Confidential Stablecoin – Private mint/burn with compliance', id: 'confidential-stablecoin-pro' }
      ];

      const chosenList = pathChoice.startsWith('1') ? coreList : proList;

      console.log('\n');
      chosenList.forEach((item, idx) => {
        const num = (idx + 1).toString();
        console.log(`${chalk.cyan(num + '.')} ${chalk.white(item.title)}`);
      });

      const { selection } = await inquirer.prompt([
        {
          type: 'input',
          name: 'selection',
          message: 'Type the number of the example you want to create:',
          validate: (input: string) => {
            const n = Number(input);
            if (!Number.isInteger(n) || n < 1 || n > chosenList.length) {
              return `Please enter a number between 1 and ${chosenList.length}`;
            }
            return true;
          }
        }
      ]);

      const idx = Number(selection) - 1;
      const chosen = chosenList[idx];
      if (!chosen) {
        console.error(chalk.red('\n❌ Invalid selection. Exiting.'));
        process.exit(1);
      }

      const projectName = `${chosen.id.replace(/[^a-z0-9-]/g, '')}-example`;
      const isPro = pathChoice.startsWith('2');

      console.log(chalk.cyan(`\nCreating example: ${chosen.title}`));
      try {
        await createExample({ name: projectName, category: chosen.id, isPro });
        console.log(chalk.green.bold(`\n✅ Created ${projectName}`));
        console.log(chalk.cyan('\nInstalling dependencies and running tests...\n'));
        
        // Import child_process to run commands
        const { execSync } = await import('child_process');
        
        try {
          // Change to project directory and run npm install + npm test
          const cwd = projectName;
          console.log(chalk.gray(`📦 Installing npm packages...`));
          execSync('npm install', { cwd, stdio: 'inherit' });
          
          console.log(chalk.gray(`\n🧪 Running tests...\n`));
          execSync('npm test', { cwd, stdio: 'inherit' });
          
          console.log(chalk.green.bold(`\n✅ All done! Your project is ready at: ${projectName}\n`));
        } catch (err: any) {
          console.error(chalk.yellow(`\n⚠️  Installation/test encountered an issue, but your project is created at: ${projectName}`));
          console.error(chalk.gray(`You can manually run: cd ${projectName} && npm install && npm test\n`));
        }
      } catch (err: any) {
        console.error(chalk.red.bold(`\n❌ Creation failed: ${err?.message || String(err)}`));
        process.exit(1);
      }

    } catch (err: any) {
      console.error(chalk.red(`\n❌ Error: ${err?.message || String(err)}`));
      process.exit(1);
    }
  });

program.parse();
