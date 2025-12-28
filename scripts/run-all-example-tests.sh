#!/usr/bin/env bash
set -euo pipefail

# Run npm test for each example under central-repo/examples
# Skips directories without a `test` script and summarizes failures

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXAMPLES_DIR="$ROOT_DIR/central-repo/examples"

if [ ! -d "$EXAMPLES_DIR" ]; then
  echo "Examples directory not found: $EXAMPLES_DIR"
  exit 1
fi

failed=()

echo "Running example tests under: $EXAMPLES_DIR"

# Find package.json files up to one level deep (example folders)
while IFS= read -r -d $'\0' pkg; do
  dir="$(dirname "$pkg")"
  echo
  echo "=== Running tests in: $dir ==="

  # Check if package.json defines a test script
  if node -e "try{ const p=require(process.argv[1]); process.exit(p.scripts && p.scripts.test ? 0 : 1) }catch(e){ process.exit(1) }" "$pkg"; then
    (cd "$dir" && npm test) || {
      echo "FAILED: tests in $dir"
      failed+=("$dir")
    }
  else
    echo "SKIP (no test script): $dir"
  fi

done < <(find "$EXAMPLES_DIR" -maxdepth 2 -type f -name package.json -print0)

echo
if [ ${#failed[@]} -ne 0 ]; then
  echo "Summary: Some example tests failed:"
  for f in "${failed[@]}"; do
    echo " - $f"
  done
  exit 1
fi

echo "Summary: All example tests passed or were skipped (no test script)."
exit 0
