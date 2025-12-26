# Codespaces Setup for fhEVM Playground

This repository's devcontainer is configured to run the interactive guided onboarding automatically when a Codespace starts. That means when the Codespace finishes starting it will immediately run:

  npx create-fhevm-playground-pro guided

Important: this is the default behavior and will block Codespace startup until the interactive guided flow completes. Only use this default in personal or single-user Codespaces.

How to disable the automatic interactive guided run

- Option A (preferred): Set an environment variable in the Codespace settings named `CODESPACE_SKIP_GUIDED` with value `true`, then rebuild/restart the Codespace.
- Option B: Edit `.devcontainer/devcontainer.json` and remove or change the `postStartCommand` entry.

Non-interactive automatic create

If you prefer an automatic, non-interactive project creation on Codespace start (no prompts), add a `postStartCommand` entry that runs `create` with explicit flags. Example (edit `.devcontainer/devcontainer.json`):

  npx create-fhevm-playground-pro create --name my-example --category confidential-stablecoin --pro

Notes and recommendations

- Default behavior: interactive `guided` runs on start and blocks until completion.
- Disable it for shared/team Codespaces to avoid blocking other users.
- The devcontainer already installs the CLI during `postCreateCommand` so the `npx` call runs without the initial `Ok to proceed?` prompt.

If you'd like, I can change the devcontainer to make guided autorun opt-in instead of the default (recommended for public/shared repos). Tell me which default you prefer.
3. Rebuild or restart the Codespace.
