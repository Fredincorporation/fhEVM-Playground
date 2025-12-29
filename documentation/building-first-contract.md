# Building Your First Contract

Learn how to create and modify your first fhEVM smart contract.

## Overview

In this walkthrough, you'll:
1. Create a new example project using the scaffolder
2. Understand the project structure
3. Review the generated smart contract
4. Modify it to add a new feature
5. Run tests to verify your changes

## Step 1: Create the Project

```bash
create-fhevm-playground-pro create --name my-vault --category basic-counter
cd my-vault
npm install
```

## Step 2: Explore the Project Structure

```
my-vault/
├── contracts/           # Solidity smart contracts
│   └── *.sol           # Your contract files
├── test/               # Test files
│   └── *.test.ts       # TypeScript tests
├── scripts/            # Deployment and utility scripts
├── fhevm/              # fhEVM library shim (pre-compiled)
├── hardhat.config.js   # Hardhat configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## Step 3: Review the Smart Contract

Open `contracts/YourContract.sol` (or similar):

```solidity
pragma solidity ^0.8.24;

import "./fhevm/lib/TFHE.sol";

contract BasicCounter {
    euint32 encryptedCount;
    
    function increment() public {
        encryptedCount = TFHE.add(encryptedCount, TFHE.asEuint32(1));
    }
    
    function getCount(bytes calldata encryptedInput) 
        public 
        view 
        returns (bytes memory) 
    {
        // Encrypted comparison and return
        return TFHE.asEuint32(encryptedCount).toBytes();
    }
}
```

## Step 4: Understand the Key Components

### Encrypted Types (`euint*`)
- `euint8`, `euint16`, `euint32`, `euint64` — Encrypted unsigned integers
- Operations on encrypted data happen **without decryption**
- Only the contract owner can decrypt using their private key

### TFHE Library Functions
- `TFHE.add()` — Add two encrypted values
- `TFHE.sub()` — Subtract
- `TFHE.mul()` — Multiply
- `TFHE.eq()`, `TFHE.lt()`, `TFHE.gt()` — Comparisons
- `TFHE.select()` — Conditional operations

### Testing in Mocked Mode
```bash
npm test
```

Tests use mocked FHE operations, so you can:
- Verify logic without a live FHE network
- Test gas efficiency
- Validate contract behavior

## Step 5: Modify the Contract

Let's add a `reset()` function:

```solidity
function reset() public {
    encryptedCount = TFHE.asEuint32(0);
}
```

Add a test in `test/YourContract.test.ts`:

```typescript
it('should reset the counter', async () => {
    const { counter } = await setup();
    await counter.increment();
    await counter.reset();
    // Verify the counter is reset
});
```

Run tests:
```bash
npm test
```

## Step 6: Deploy to Testnet (Later)

Once you're ready, use the deployment scripts:

```bash
npm run deploy:testnet
```

(Requires testnet funds and configuration — see [Deployment Guide](../central-repo-docs/README.md))

## Common Patterns

### Encrypted State
```solidity
euint32 private encryptedBalance;
```

### Conditional Logic
```solidity
bool isGreater = TFHE.decrypt(TFHE.gt(a, b));
if (isGreater) { /* ... */ }
```

### Batch Operations
```solidity
euint32 result = TFHE.add(
    TFHE.mul(a, b),
    TFHE.add(c, d)
);
```

## Next Steps

- [Testing with Mocked Mode](walkthroughs.md) — Advanced testing patterns
- [Core Concepts](core-concepts.md) — Understand FHE fundamentals
- [fhEVM Architecture](architecture.md) — How the system works
- [24 Complete Examples](examples.md) — Browse advanced examples
