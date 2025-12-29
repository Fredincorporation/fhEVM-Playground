# Troubleshooting

Solutions to common issues when building FHE contracts.

## Installation & Setup

### "Node.js not found"
```bash
# Check Node.js is installed
node --version

# If not, download from https://nodejs.org/
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
```

### "Permission denied" when installing globally
```bash
# Use sudo (not recommended long-term)
sudo npm install -g create-fhevm-playground-pro
# Better: Use nvm (Node Version Manager)
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
# Use the interactive, zero-install guided flow instead
npx create-fhevm-playground-pro guided
```

## Running Tests

### "npm test" hangs or is slow
```bash
# Ensure you're in mocked mode (fastest)
npm test

# If still slow, check:
# 1. Available RAM
# 2. Close other processes
# 3. Clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
npm test
```

### Tests fail with "TFHE not found"
```bash
# Ensure fhevm is properly installed
ls -la fhevm/lib/TFHE.sol

# If missing, reinstall
rm -rf node_modules
npm install
npm test
```

## Building Contracts

### "Compilation error: unexpected token"
```bash
# Check Solidity version in hardhat.config.js
# Should be: pragma solidity ^0.8.24;

# Update hardhat if needed
npm install --save-dev hardhat@latest
npm run build
```

### "Unknown type euint32"
```solidity
// Make sure you imported TFHE.sol
import "./fhevm/lib/TFHE.sol";

contract MyContract {
    euint32 private balance; // Now it works
}
```

## Deployment

### "Insufficient gas"
```bash
# Increase gas limit in hardhat.config.js
module.exports = {
    networks: {
        sepolia: {
            gasPrice: "auto",
            gas: 5000000, // Increase if needed
        },
    },
};
```

### "Private key not found"
```bash
# Create .env file with testnet account
echo "PRIVATE_KEY=0x..." >> .env

# Never commit .env to Git!
echo ".env" >> .gitignore
```

## FHE Operations

### "Overflow in encrypted addition"
```solidity
// Check bounds before adding
require(
    TFHE.decrypt(TFHE.lt(
        TFHE.add(balance, amount),
        MAX_UINT32
    )),
    "Overflow"
);
balance = TFHE.add(balance, amount);
```

### "Decryption fails"
```bash
# Ensure private key is correct
# Ensure encrypted data uses matching public key
# Verify you're using the right decryption function

# In tests, use mocked decryption
const value = TFHE.decrypt(encryptedValue);
```

## Codespaces

### "Guided CLI doesn't start"
```bash
# Check if it already ran
ls /workspaces/.fhevm_guided_ran

# To skip and run manually
rm /workspaces/.fhevm_guided_ran
create-fhevm-playground-pro guided
```

### "Container build fails"
```bash
# Rebuild the devcontainer
# In Codespaces: Ctrl+Shift+P > "Rebuild Container"

# Or recreate Codespace
# GitHub → Codespaces → Delete and recreate
```

## Git & Version Control

### ".gitignore not working"
```bash
# Remove cached files
git rm --cached node_modules -r
git rm --cached .env
git rm --cached dist -r

# Recreate .gitignore with:
# node_modules/
# .env
# dist/
# artifacts/

git add .gitignore
git commit -m "Fix gitignore"
```

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Cannot find module 'hardhat'" | `npm install` |
| "Port 8545 in use" | Kill process: `lsof -i :8545` |
| "out of memory" | Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm test` |
| "Module not found: TFHE" | Check `fhevm/lib/` directory exists |
| "Invalid encrypted data" | Verify encryption with matching public key |

## Getting Help

1. **Check the docs**: [Documentation Home](README.md)
2. **Search issues**: [GitHub Issues](https://github.com/Fredincorporation/fhEVM-Playground/issues)
3. **Ask on Discord**: [Zama Discord](https://discord.gg/zama)
4. **Open an issue**: Include error message, steps to reproduce, and environment info

## FAQ

See [FAQ](faq.md) for frequently asked questions.

## Next Steps

- [Documentation Home](README.md) — Full reference
- [Security](security.md) — Security best practices
- [Getting Started](getting-started.md) — Beginner guide
