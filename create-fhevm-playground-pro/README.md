# create-fhevm-playground-pro

Premium scaffolding CLI for fhEVM Playground Pro — Zama bounty (Dec 2025).

## 🚀 Quick Start

### First Time Setup (One-Time)
Run this setup command once to remove npx prompts:

```bash
npm config set yes true
```

This configures npm to auto-answer download prompts, so you'll never see the "Ok to proceed?" message again.

### Interactive Guided Mode
Start the automated example creation:

```bash
npx create-fhevm-playground-pro guided
```

Then simply:
1. Choose path (Core Concepts or Pro Apps)
2. Choose example number
3. Watch it automatically scaffold, install, and test! ✨

### Direct Creation (Scripting)
```bash
npx create-fhevm-playground-pro create \
  --name my-project \
  --category confidential-stablecoin \
  --pro
```

### Available Categories

**Core Concepts (12 examples)**
- `basic-counter`, `arithmetic`, `comparisons`, `single-encryption`, `access-control`, `input-verification-proofs`, `anti-patterns-guide`, `handles-lifecycle`, `oz-erc7984-basic`, `oz-erc20-wrapper`, `vesting`, `blind-auction`

**Pro Apps (7 examples)** - requires `--pro` flag
- `confidential-stablecoin`, `blind-dex`, `dao-voting`, `encrypted-poker`, `private-lending`, `yield-farming`, `mev-arbitrage`

## 📚 What You Get

Each scaffold includes:
- ✅ Full Hardhat setup with Solidity compilation
- ✅ Real contract examples from central-repo (if available)
- ✅ Complete test suite with Mocha + TypeScript
- ✅ Test helpers for FHE operations
- ✅ TypeScript support with ts-node
- ✅ Git initialization

## 🎯 Features

- **Fully Automated**: No manual `npm install` or `npm test` needed in guided mode
- **Zero Configuration**: Works out of the box
- **Category Aliases**: Use short names like `blind-dex` instead of full names
- **Fallback Tests**: Always has tests, even without central-repo
- **Clean Output**: No warnings or unnecessary messages
- **Cross-Platform**: Works on Linux, macOS, Windows

## 💡 Tips

- First-time users: Start with `guided` mode for the complete experience
- Scripting/CI/CD: Use the `create` command with options
- Global install: `npm install -g create-fhevm-playground-pro` to skip npx delays

See the full project site and GitHub repository for more details.
