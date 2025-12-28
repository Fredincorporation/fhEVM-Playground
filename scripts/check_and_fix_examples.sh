#!/bin/bash
set -euo pipefail

ROOT_DIR=$(pwd)
for d in "$ROOT_DIR/central-repo/examples"/*-premium; do
  [ -d "$d" ] || continue
  echo
  echo "=== Processing: $d ==="
  if [ -f "$d/package.json" ]; then
    echo "package.json found"
    (cd "$d" && \
      echo "-> Running npm install" && npm install --no-audit --no-fund --silent || true && \
      echo "-> Running npx hardhat compile" && npx hardhat compile --show-stack-traces || echo "-> compile failed for $d")
  else
    echo "no package.json — creating temporary project for isolated compile"
    tmp_pkg="$d/.tmp_package.json"
    tmp_hh="$d/.tmp_hardhat.config.js"
    cat > "$tmp_pkg" <<'JSON'
{
  "name": "example-temp",
  "version": "0.0.0",
  "private": true,
  "devDependencies": {
    "hardhat": "^3.0.0"
  }
}
JSON

    cat > "$tmp_hh" <<'JS'
require('hardhat/config');
module.exports = {
  solidity: '0.8.19',
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './.hardhat_cache',
    artifacts: './artifacts'
  }
};
JS

    (cd "$d" && \
      echo "-> Installing minimal hardhat locally" && npm install --no-audit --no-fund --silent --no-save || true && \
      echo "-> Running npx hardhat compile (isolated)" && npx hardhat compile --show-stack-traces) || echo "-> compile failed for $d"

    rm -f "$tmp_pkg" "$tmp_hh"
  fi

done

echo "All done."