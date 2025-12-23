# Quick Start Guide

Get up and running with fhEVM Playground Pro in 5 minutes.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 9+** - Comes with Node.js

Check your versions:
```bash
node --version
npm --version
```

## Installation

```bash
npm install -g create-fhevm-playground-pro
```

## Create Your First Example

```bash
create-fhevm-playground-pro create --name my-counter --category basic-counter
cd my-counter
npm install
npm run test:mock
```

**Expected output:**
```
✅ 0 passing (2ms)
✅ 2 pending
```

Congratulations! 🎉 You now have a working FHE contract.

## What's Next

1. Explore the code in `contracts/BasicCounter.sol`
2. Read the generated `README.md`
3. Try `npm run compile` to compile the Solidity
4. Try modifying the contract and running tests again

## Available Categories

```bash
# List all available examples
create-fhevm-playground-pro list
```

Visit the [CLI Reference](cli-reference.md) for complete command details.
