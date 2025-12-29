#!/bin/bash
set -euo pipefail

# One-time guard marker path (in the Codespaces /workspaces mount)
MARKER="/workspaces/.fhevm_guided_ran"

# Allow skipping via env var
if [ "${CODESPACE_SKIP_GUIDED:-}" = "true" ]; then
  echo "Skipping guided autorun because CODESPACE_SKIP_GUIDED=true"
  exit 0
fi

if [ -f "$MARKER" ]; then
  echo "Guided onboarding already ran (marker found at $MARKER). Skipping."
  exit 0
fi

# Navigate to scaffolder package and run the guided CLI.
# This script runs on Codespaces attach. It installs deps and builds,
# then starts the interactive guided scaffolder.

cd "$(dirname "$(dirname "$0")")" || exit 1

echo "Preparing create-fhevm-playground-pro..."
cd create-fhevm-playground-pro || { echo "create-fhevm-playground-pro not found"; exit 1; }

echo "Installing dependencies (this may take a moment)..."
npm install --no-audit --no-fund

echo "Building scaffolder..."
npm run build

echo "Launching guided scaffolder (interactive). Use the terminal to interact with prompts."

# Run the interactive CLI; after it exits successfully, create the marker file
if npx create-fhevm-playground-pro guided; then
  mkdir -p "$(dirname "$MARKER")" || true
  touch "$MARKER"
  echo "Guided run completed; marker created at $MARKER"
else
  echo "Guided run failed or was aborted; marker will not be created"
  exit 1
fi
