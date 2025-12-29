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

# Note: npm install and npm run build already ran in postCreateCommand
# This script just runs the interactive guided CLI on attach

cd /workspaces/fhEVM-Playground/create-fhevm-playground-pro || { echo "create-fhevm-playground-pro not found"; exit 1; }

echo "Launching guided scaffolder (interactive). Use the terminal to interact with prompts."

# Run the built CLI directly (compiled TypeScript in dist/)
if node ./dist/create-example.js guided; then
  mkdir -p "$(dirname "$MARKER")" || true
  touch "$MARKER"
  echo "Guided run completed; marker created at $MARKER"
else
  echo "Guided run failed or was aborted; marker will not be created"
  exit 1
fi
