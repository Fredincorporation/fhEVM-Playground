# CLI Commands Reference

Complete reference for the `create-fhevm-playground-pro` scaffolder.

## Installation

```bash
npx create-fhevm-playground-pro guided
```

## Available Commands

### `create-fhevm-playground-pro create`

Create a new example project.

**Usage**:
```bash
create-fhevm-playground-pro create --name <project-name> --category <category>
```

**Options**:
- `--name <name>` — Project name (required, e.g., `my-counter`)
- `--category <category>` — Example category (required)
- `--help` — Show help

**Available Categories**:
- `basic-counter` — Simple encrypted counter
- `arithmetic-premium` — Encrypted arithmetic operations
- `comparisons` — Comparison operations on encrypted data
- `access-control` — FHE.allow() access control patterns
- `input-proofs` — Input verification and proofs
- `anti-patterns` — Common mistakes to avoid
- `handles` — Handle and lifecycle management
- `symbolic-execution` — Analysis and verification
- `erc-standards` — OpenZeppelin standard implementations
- `blind-auction` — Confidential auction example
- `confidential-dao` — Private DAO voting
- `private-lending` — Encrypted lending pool
- `blind-dex` — MEV-resistant DEX order book
- `encrypted-poker` — Confidential card game
- `yield-farming` — Private yield farming
- `mev-arbitrage` — MEV-resistant arbitrage
- `stablecoin` — Confidential stablecoin

**Examples**:
```bash
# Create a basic counter
create-fhevm-playground-pro create --name my-counter --category basic-counter

# Create an arithmetic example
create-fhevm-playground-pro create --name my-math --category arithmetic-premium

# Create a DAO voting example
create-fhevm-playground-pro create --name my-dao --category confidential-dao
```

### `create-fhevm-playground-pro guided`

Interactive guided mode (prompts for project details).

**Usage**:
```bash
create-fhevm-playground-pro guided
```

**What it does**:
1. Prompts for project name
2. Shows list of available categories
3. Creates the project
4. Shows next steps

## Post-Creation Commands

After scaffolding, your project includes npm scripts:

```bash
cd my-counter

# Run tests in mocked mode
npm test

# Compile smart contracts
npm run build

# Deploy to testnet
npm run deploy:testnet

# View help
npm run --list
```

## Global Installation Management

### Update the scaffolder
```bash
npx create-fhevm-playground-pro guided
```

### List installed global packages
```bash
npm list -g --depth=0
```

### Uninstall
```bash
npm uninstall -g create-fhevm-playground-pro
```

## Using npx (No Global Install)

```bash
# Run without installing globally
npx create-fhevm-playground-pro create --name my-project --category basic-counter

# Run interactive mode
npx create-fhevm-playground-pro guided
```

## Environment Variables

### Skip Guided Mode in Codespaces
```bash
export CODESPACE_SKIP_GUIDED=true
```

### Custom Installation Path
```bash
NPM_CONFIG_PREFIX=/custom/path npx create-fhevm-playground-pro guided
```

## Troubleshooting

### "Command not found"
- Ensure Node.js is installed: `node --version`
-- Run interactively with npx: `npx create-fhevm-playground-pro guided`

### "Permission denied"
- On macOS/Linux: `sudo npx create-fhevm-playground-pro guided`
- Or use a Node version manager like [nvm](https://github.com/nvm-sh/nvm)

### Project creation fails
- Check available disk space
- Verify npm cache: `npm cache clean --force`
- Try again: `create-fhevm-playground-pro create --name test --category basic-counter`

## Next Steps

- [Quick Start Guide](quick-start.md) — Get running in 30 seconds
- [Building Your First Contract](building-first-contract.md) — Understand the generated code
- [Documentation Home](README.md) — Full reference
