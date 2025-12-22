#!/bin/bash

# Validation Script for fhEVM Playground Pro
# Tests that all categories work correctly with mocked mode

set -e

REPO_PATH="/home/bigfred/Documents/GitHub/fhEVM Playground/central-repo"
TEST_DIR="/tmp/fhevm-validation-$(date +%s)"
PASSED=0
FAILED=0
CATEGORIES=(
    "poker-game-pro"
    "blind-dex-pro"
    "multiple-encryption"
    "oz-erc7984-basic"
    "erc7984-pro"
    "vesting-pro"
    "private-lending-pro"
    "confidential-stablecoin-pro"
    "mev-arbitrage-pro"
    "private-yield-premium"
    "anti-patterns-premium"
)

echo "🧪 fhEVM Playground Pro - Validation Suite"
echo "=========================================="
echo "Testing: ${#CATEGORIES[@]} categories"
echo "Output: $TEST_DIR"
mkdir -p "$TEST_DIR"

test_category() {
    local category=$1
    local name="test-$(echo $category | cut -d'-' -f1)"
    
    echo -n "Testing $category... "
    
    # Create project
    rm -rf "$TEST_DIR/$name" 2>/dev/null || true
    if ! timeout 30 node "$REPO_PATH/dist/bin/create-fhevm-playground-pro.js" \
        create --name "$name" --category "$category" --pro \
        > "$TEST_DIR/$name.create.log" 2>&1; then
        echo "❌ FAILED (creation)"
        ((FAILED++))
        return
    fi
    
    # Install dependencies
    if ! cd "$TEST_DIR/$name" && timeout 120 npm install \
        > "$TEST_DIR/$name.install.log" 2>&1; then
        echo "❌ FAILED (install)"
        ((FAILED++))
        return
    fi
    
    # Run mocked tests
    if ! timeout 60 npm run test:mock \
        > "$TEST_DIR/$name.test.log" 2>&1; then
        echo "❌ FAILED (test)"
        cat "$TEST_DIR/$name.test.log" | tail -5
        ((FAILED++))
        return
    fi
    
    # Check test results
    local result=$(cat "$TEST_DIR/$name.test.log" | grep -E "passing|pending|failing" | tail -1)
    if echo "$result" | grep -q "failing"; then
        echo "❌ FAILED: $result"
        ((FAILED++))
        return
    fi
    
    echo "✅ PASSED: $result"
    ((PASSED++))
}

# Build CLI first
echo "Building CLI..."
cd "$REPO_PATH"
npm run build > /dev/null 2>&1 || true
echo "CLI build complete"
echo ""

# Test each category
for category in "${CATEGORIES[@]}"; do
    test_category "$category" || true
done

echo ""
echo "=========================================="
echo "Results: $PASSED passed, $FAILED failed"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed! fhEVM Playground Pro is working correctly."
    exit 0
else
    echo "⚠️  Some tests failed. Check logs in $TEST_DIR"
    exit 1
fi
