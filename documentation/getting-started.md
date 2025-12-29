# Getting Started

Welcome to fhEVM Playground Pro! This guide will help you set up your development environment and create your first fully homomorphic encryption (FHE) smart contract.

## What You'll Learn

This getting started guide covers:
1. Prerequisites and environment setup
2. Installing the scaffolder
3. Creating your first example project
4. Running tests in mocked mode
5. Understanding the generated project structure

## Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** (included with Node.js)
- **Git** (recommended, for version control)
- **A code editor** (VS Code recommended)

## Installation Overview

There are three ways to get started:

### Fastest: GitHub Codespaces (Recommended for Beginners)
- Click "Open in GitHub Codespaces" on the landing page
- Everything pre-installed and ready to use
- No local setup required

### Standard: Local Installation
- Install Node.js on your machine
- Use `npx create-fhevm-playground-pro guided`
- Create projects with the scaffolder

### Advanced: From Source
- Clone the repository
- Build the scaffolder locally
- Contribute to the project

## Your First Project (5 minutes)

```bash
# Install via npx (preferred)
npx create-fhevm-playground-pro guided

# Create a new project
create-fhevm-playground-pro create --name my-first-fhe --category basic-counter

# Install dependencies and run tests
cd my-first-fhe
npm install
npm test
```

You should see 50+ tests passing! ✅

## What's Next?

- **[Quick Start Guide](quick-start.md)** — 30-second setup instructions
- **[Installation & Setup](installation-setup.md)** — Detailed OS-specific setup
- **[Building Your First Contract](building-first-contract.md)** — Understanding what you just created
- **[Core Concepts](core-concepts.md)** — Learn FHE fundamentals

## Need Help?

- Check the [FAQ](faq.md) for common questions
- See [Troubleshooting](troubleshooting.md) for solutions
- Open an issue on the [GitHub repository](https://github.com/Fredincorporation/fhEVM-Playground)
