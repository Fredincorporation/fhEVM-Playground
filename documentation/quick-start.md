# Quick Start Guide

Get up and running in ~30 seconds.

## Prerequisites

- Node.js (v18+ recommended) or use GitHub Codespaces for zero-install.
- npm (bundled with Node.js)
- Git (for Codespaces, pre-installed)

## Option 1: Global Installation (Recommended)

```bash
npm install -g create-fhevm-playground-pro
create-fhevm-playground-pro create --name my-counter --category basic-counter
cd my-counter
npm install
npm test
```

## Option 2: Using npx (No Global Install)

```bash
npx create-fhevm-playground-pro create --name my-counter --category basic-counter
cd my-counter
npm install
npm test
```

## Option 3: GitHub Codespaces (Zero-Install)

1. Click the **"Open in GitHub Codespaces"** button on the landing page
2. The container will automatically:
   - Install Node.js and dependencies
   - Build the scaffolder
   - Launch the guided CLI
3. Follow the CLI prompts to generate your first example
4. Tests will run automatically once the project is scaffolded

## Expected Result

✅ All tests should pass (typically 50+ test cases)

## Next Steps

- [Installation & Setup](installation-setup.md) - Detailed setup for your OS
- [Building Your First Contract](building-first-contract.md) - Walkthrough of creating a contract
- [CLI Commands Reference](cli-commands.md) - All available scaffolder options
- [Documentation Home](README.md) - Full documentation index
