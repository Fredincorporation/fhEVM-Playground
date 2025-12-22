/**
 * Batch Update fhEVM Version Script
 *
 * Updates @zama.ai/fhevm across all example repositories
 *
 * Usage:
 *   ts-node scripts/batch-update-fhevm-version.ts 0.10.0
 *   ts-node scripts/batch-update-fhevm-version.ts 0.10.0 --dry-run
 */
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
const args = process.argv.slice(2);
const newVersion = args[0];
const isDryRun = args.includes('--dry-run');
function validateVersion(version) {
    return /^\d+\.\d+\.\d+/.test(version);
}
function getExamplesDir() {
    return path.resolve(__dirname, '../examples');
}
function findExamples() {
    const examplesDir = getExamplesDir();
    if (!fs.existsSync(examplesDir)) {
        console.warn(chalk.yellow(`⚠️  Examples directory not found: ${examplesDir}`));
        return [];
    }
    const examples = [];
    const entries = fs.readdirSync(examplesDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const packageJsonPath = path.join(examplesDir, entry.name, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                examples.push(path.join(examplesDir, entry.name));
            }
        }
    }
    return examples;
}
function updatePackageJson(packageJsonPath, newVer) {
    const dir = path.dirname(packageJsonPath);
    const exampleName = path.basename(dir);
    try {
        const packageJson = fs.readJsonSync(packageJsonPath);
        // Check if @zama.ai/fhevm is present
        if (!packageJson.dependencies?.['@zama.ai/fhevm'] &&
            !packageJson.devDependencies?.['@zama.ai/fhevm']) {
            return {
                name: exampleName,
                success: false,
                message: '@zama.ai/fhevm not found in dependencies',
            };
        }
        // Get old version
        const oldVersion = packageJson.dependencies?.['@zama.ai/fhevm'] ||
            packageJson.devDependencies?.['@zama.ai/fhevm'];
        if (isDryRun) {
            return {
                name: exampleName,
                success: true,
                message: '[DRY RUN] Would update',
                oldVersion,
                newVersion: `^${newVer}`,
            };
        }
        // Update version
        if (packageJson.dependencies?.['@zama.ai/fhevm']) {
            packageJson.dependencies['@zama.ai/fhevm'] = `^${newVer}`;
        }
        if (packageJson.devDependencies?.['@zama.ai/fhevm']) {
            packageJson.devDependencies['@zama.ai/fhevm'] = `^${newVer}`;
        }
        // Write back
        fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
        return {
            name: exampleName,
            success: true,
            message: 'Updated successfully',
            oldVersion,
            newVersion: `^${newVer}`,
        };
    }
    catch (error) {
        return {
            name: exampleName,
            success: false,
            message: `Error: ${error.message}`,
        };
    }
}
async function main() {
    console.log(chalk.blue.bold('========================================'));
    console.log(chalk.blue.bold('fhEVM Batch Update Script'));
    console.log(chalk.blue.bold('========================================'));
    console.log('');
    // Validate input
    if (!newVersion) {
        console.error(chalk.red('✗ Version not provided'));
        console.log('Usage: ts-node scripts/batch-update-fhevm-version.ts <version> [--dry-run]');
        console.log('Example: ts-node scripts/batch-update-fhevm-version.ts 0.10.0');
        process.exit(1);
    }
    if (!validateVersion(newVersion)) {
        console.error(chalk.red(`✗ Invalid version format: ${newVersion}`));
        console.log('Expected format: X.Y.Z (e.g., 0.10.0)');
        process.exit(1);
    }
    console.log(chalk.green(`✓ Version format valid: ${newVersion}`));
    console.log('');
    if (isDryRun) {
        console.log(chalk.yellow('⚠️  Running in DRY RUN mode - no files will be modified'));
        console.log('');
    }
    // Find examples
    console.log(chalk.blue.bold('Finding Examples'));
    const examples = findExamples();
    if (examples.length === 0) {
        console.warn(chalk.yellow('⚠️  No examples found'));
        process.exit(0);
    }
    console.log(chalk.green(`✓ Found ${examples.length} example repositories`));
    console.log('');
    // Update each example
    console.log(chalk.blue.bold('Updating Dependencies'));
    const results = [];
    for (const exampleDir of examples) {
        const packageJsonPath = path.join(exampleDir, 'package.json');
        const result = updatePackageJson(packageJsonPath, newVersion);
        results.push(result);
        if (result.success) {
            if (isDryRun) {
                console.log(chalk.cyan(`  [DRY RUN] ${result.name}: ${result.oldVersion} → ${result.newVersion}`));
            }
            else {
                console.log(chalk.green(`  ✓ ${result.name}: ${result.oldVersion} → ${result.newVersion}`));
            }
        }
        else {
            console.log(chalk.red(`  ✗ ${result.name}: ${result.message}`));
        }
    }
    console.log('');
    // Summary
    console.log(chalk.blue.bold('Summary'));
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`Total processed: ${results.length}`);
    console.log(chalk.green(`Successful: ${successful}`));
    if (failed > 0) {
        console.log(chalk.red(`Failed: ${failed}`));
    }
    console.log('');
    if (isDryRun) {
        console.log(chalk.yellow('DRY RUN completed - no changes made'));
        console.log('Run without --dry-run to apply changes');
    }
    else if (successful > 0) {
        console.log(chalk.green('Update completed!'));
        console.log('');
        console.log('Next steps:');
        console.log('  1. Review changes: git diff package.json');
        console.log('  2. Run: npm install');
        console.log('  3. Test: npm test');
        console.log(`  4. Commit: git commit -am "chore: update fhEVM to ${newVersion}"`);
    }
    console.log('');
}
main().catch(error => {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
});
//# sourceMappingURL=batch-update-fhevm-version.js.map