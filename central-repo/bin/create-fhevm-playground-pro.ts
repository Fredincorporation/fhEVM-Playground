#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createExample } from '../src/scaffolder.js';
import { CATEGORIES } from '../src/templates-index.js';

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

      await createExample({
        name: options.name,
        category: options.category,
        isPro: options.pro || false,
      });

      console.log(chalk.green.bold('\n✅ Project created successfully!\n'));
      console.log(chalk.cyan(`Next steps:`));
      console.log(chalk.white(`  cd ${options.name}`));
      console.log(chalk.white(`  npm install`));
      console.log(chalk.white(`  npm run test\n`));
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`));
      process.exit(1);
    }
  });

program
  .command('guided')
  .description('Interactive guided onboarding for fhEVM Playground Pro')
  .action(async () => {
    try {
      // Clear and welcome
      console.clear();
      console.log(chalk.cyan.bold('🔒 Welcome to fhEVM Playground Pro 🔒'));

      // Educational paragraph (exact text required)
      console.log(
        chalk.white(
          "Fully Homomorphic Encryption (FHE) enables computation on encrypted data without decryption — a breakthrough for blockchain privacy. Zama's fhEVM brings this power to Ethereum-compatible chains, allowing confidential balances, private voting, blind auctions, MEV-resistant DeFi, and more, all while preserving verifiability. fhEVM Playground Pro is the premium, fully automated example hub built for Zama's December 2025 bounty: 14 core concept examples covering every fundamental + 7 innovative real-world Pro applications in confidential finance, governance, and gaming. Let's dive in and build something private!"
        )
      );

      // Path selection
      const { pathChoice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'pathChoice',
          message: 'What would you like to explore first?',
          choices: [
            '1. Core Concepts (Master fhEVM fundamentals – 14 examples)',
            '2. Innovative Pro Apps (Real-world confidential apps – 7 examples)',
          ],
        },
      ]);

      // Define example lists (display text + category id)
      const coreList = [
        { title: 'Basic Counter – Encrypted increment & view', id: 'basic-counter' },
        { title: 'Arithmetic Operations – Add, sub, mul on encrypted values', id: 'arithmetic' },
        { title: 'Comparisons & Inequalities – eq, gt, lt on encrypted data', id: 'comparisons' },
        { title: 'Single Encryption – User-side encryption of values', id: 'single-encryption' },
        { title: 'Public Encryption – Contract-side public patterns', id: 'public-encryption' },
        { title: 'Access Control – FHE.allow & allowTransient', id: 'access-control' },
        { title: 'Input Proofs – Why and how to verify client inputs', id: 'input-verification-proofs' },
        { title: 'Anti-Patterns & Edge Cases – Common mistakes to avoid', id: 'anti-patterns-guide' },
        { title: 'Handles & Lifecycle – Symbolic execution and management', id: 'handles-lifecycle' },
        { title: 'ERC7984 Basic – Modular FHE standard', id: 'erc7984-basic' },
        { title: 'Private ERC20 – ERC20 with encrypted balances', id: 'private-erc20' },
        { title: 'Swaps & AMM – Confidential AMM patterns', id: 'swaps' },
        { title: 'Confidential Vesting Wallet', id: 'vesting' },
        { title: 'Blind Auction – Sealed encrypted bids', id: 'blind-auction' },
      ];

      const proList = [
        { title: 'Confidential DAO Voting – Private votes, homomorphic tally', id: 'dao-voting-pro' },
        { title: 'Private Lending Pool – Encrypted loans & collateral', id: 'private-lending-pro' },
        { title: 'Blind DEX Order Book – MEV-resistant private trades', id: 'blind-dex-pro' },
        { title: 'Encrypted Poker Game – Hidden hands, fair on-chain play', id: 'poker-game-pro' },
        { title: 'Private Yield Farming – Confidential positions & rewards', id: 'yield-farming-pro' },
        { title: 'MEV-Resistant Arbitrage – Blind opportunity execution', id: 'mev-arbitrage-pro' },
        { title: 'Confidential Stablecoin – Private mint/burn with compliance', id: 'confidential-stablecoin-pro' },
      ];

      // Show chosen list
      const chosenList = pathChoice.startsWith('1') ? coreList : proList;

      console.log('\n');
      chosenList.forEach((item, idx) => {
        const num = (idx + 1).toString();
        console.log(`${chalk.cyan(num + '.')} ${chalk.white(item.title)}`);
      });

      // Ask for selection by number
      const { selection } = await inquirer.prompt([
        {
          type: 'input',
          name: 'selection',
          message: 'Type the number of the example you want to create:',
          validate: (input: string) => {
            const n = Number(input);
            if (!Number.isInteger(n) || n < 1 || n > chosenList.length) {
              return chalk.red(
                `Please enter a number between 1 and ${chosenList.length}`
              );
            }
            return true;
          },
        },
      ]);

      const idx = Number(selection) - 1;
      const chosen = chosenList[idx];
      if (!chosen) {
        console.error(chalk.red('\n❌ Invalid selection. Exiting.'));
        process.exit(1);
      }

      // Auto-generate project name from category id
      const projectName = `${chosen.id.replace(/[^a-z0-9-]/g, '')}-example`;
      const isPro = pathChoice.startsWith('2');

      // Inform user and create
      console.log(chalk.cyan(`\nCreating example: ${chosen.title}`));
      try {
        await createExample({ name: projectName, category: chosen.id, isPro });
        console.log(chalk.green.bold(`\n✅ Created ${projectName}`));
        console.log(chalk.cyan('\nNext steps:'));
        console.log(chalk.white(`  cd ${projectName}`));
        console.log(chalk.white('  npm install'));
        console.log(chalk.white('  npm test  (use MOCK=true for mocked mode)'));
        console.log(chalk.white('\n  To run with a real fhEVM node, see the project README or run the provided Docker script.'));
        console.log(chalk.white('\nRun `npx create-fhevm-playground-pro guided` again to create another example.'));
        console.log(chalk.white('\nProject site: https://example.com/fhevm-playground-pro (placeholder)\n'));
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
