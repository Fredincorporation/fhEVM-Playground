#!/bin/bash
# Simple test runner for example integration tests

cd "$(dirname "$0")"

echo "fhEVM Playground - Example Test Runner"
echo "======================================"
echo ""

# Get all example directories with tests
EXAMPLES=$(find central-repo/examples -maxdepth 2 -name "*.test.ts" | xargs dirname | sort | uniq)

for TEST_DIR in $EXAMPLES; do
  EXAMPLE_NAME=$(basename "$(dirname "$TEST_DIR")")
  echo ""
  echo "📋 Testing: $EXAMPLE_NAME"
  echo "──────────────────────"
  
  # Change to example root
  EXAMPLE_ROOT=$(dirname "$TEST_DIR")
  cd "$EXAMPLE_ROOT"
  
  # Try to run with hardhat (if configured locally)
  if [ -f "hardhat.config.js" ] || [ -f "hardhat.config.ts" ]; then
    npx hardhat test 2>&1 | grep -E "✔|✓|passing|failing" || echo "  (no tests executed)"
  else
    # Fall back to direct mocha
    npx mocha --require ts-node/register "$TEST_DIR" 2>&1 | grep -E "✔|✓|passing|failing" || echo "  (module resolution failed)"
  fi
  
  cd - > /dev/null
done

echo ""
echo "======================================"
echo "Test run complete"
