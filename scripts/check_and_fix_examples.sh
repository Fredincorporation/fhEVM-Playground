#!/bin/bash
set -euo pipefail

ROOT_DIR=$(pwd)
for d in "$ROOT_DIR/central-repo/examples"/*-premium; do
  [ -d "$d" ] || continue
  echo
  echo "=== Processing: $d ==="
  if [ -f "$d/package.json" ]; then
    echo "package.json found"
  else
    echo "no package.json"
  fi
  (cd "$d" && \
    echo "-> Running npm install" && npm install --no-audit --no-fund --silent || true && \
    echo "-> Running npx hardhat compile" && npx hardhat compile --show-stack-traces || echo "-> compile failed for $d")

done

echo "All done."