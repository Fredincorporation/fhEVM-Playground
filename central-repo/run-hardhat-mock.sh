#!/usr/bin/env bash
set -euo pipefail
# Wrapper to run Hardhat tests using the CJS config explicitly
cd "$(dirname "$0")"

echo "Running mocked Hardhat tests using hardhat.config.cjs..."
export MOCK=true
# Use explicit config file to avoid ESM config detection issues
npx hardhat test --config ./hardhat.config.cjs --show-stack-traces
