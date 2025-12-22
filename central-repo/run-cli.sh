#!/bin/bash
# Workaround script to run the CLI
# Usage: ./run-cli.sh create --name "my-project-&-name" --category confidential-dao-voting

cd "$(dirname "$0")"
npx ts-node --esm bin/create-fhevm-playground-pro.ts "$@"
