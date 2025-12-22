#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createExample } from '../src/scaffolder';
import { DEFAULT_CATEGORIES } from '../src/templates';

const program = new Command();

program
  .name('create-fhevm-playground-pro')
  .description('Premium CLI scaffolding tool for fhEVM examples')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new fhEVM example project')
  .requiredOption('-n, --name <name>', 'Project name (e.g., my-counter)')
  .requiredOption('-c, --category <category>', `Category: ${Object.keys(DEFAULT_CATEGORIES).join(', ')}`)
  .option('-p, --pro', 'Create PRO bonus example (unlocks pro categories)')
  .action(async (options) => {
    try {
      console.log(chalk.cyan.bold('\n🚀 fhEVM Playground Pro - Project Generator\n'));
      
      if (!DEFAULT_CATEGORIES[options.category]) {
        console.error(chalk.red(`❌ Unknown category: ${options.category}`));
        console.log(chalk.yellow(`Available categories:\n${Object.keys(DEFAULT_CATEGORIES).join(', ')}`));
        process.exit(1);
      }

      if (DEFAULT_CATEGORIES[options.category].isPro && !options.pro) {
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

program.parse();
