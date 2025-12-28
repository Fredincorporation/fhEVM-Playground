#!/bin/bash
# Run all TypeScript tests in the examples directory

cd "$(dirname "$0")"

echo "Running TypeScript tests from examples..."
echo "=========================================="

# Use npx mocha directly with ts-node
npx mocha --require ts-node/register --extensions ts,js \
  "examples/*/test/*.test.ts" \
  --timeout 20000 \
  --exit 2>&1
