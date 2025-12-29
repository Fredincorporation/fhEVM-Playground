# Quick Start Guide

Get up and running in ~30 seconds.

Prerequisites:
- Node.js (v18+ recommended) or use GitHub Codespaces for zero-install.

Global installer (optional):

```bash
npm install -g create-fhevm-playground-pro
```

Create a new example project:

```bash
create-fhevm-playground-pro create --name my-counter --category basic-counter
cd my-counter
npm install
npm run test:mock
```

Expected result:

- Tests run in mocked mode and should complete successfully.

Using the local scaffolder (if you didn't install globally):

```bash
npx create-fhevm-playground-pro create --name my-counter --category basic-counter
```

Codespaces users:

- Open the repository in GitHub Codespaces (zero-install). The container will build the scaffolder and run the guided CLI once. You can find the generated project in the workspace root.

Troubleshooting:
- If `npm run test:mock` fails, ensure dependencies installed and run `npm run build` where required.

See the documentation home for more walkthroughs and examples: [Documentation Home](README.md)
