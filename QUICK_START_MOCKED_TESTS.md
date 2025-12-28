# fhEVM Playground - Quick Start Guide

## What's New

✅ **Mocked Hardhat Test Suite - Fully Operational**
- 36 tests passing (zero network dependencies)
- Fast local development (< 1 second per run)
- Complete fhEVM encryption/decryption mock
- Ready for immediate use

---

## Quick Start

### 1. Run Mocked Tests (Recommended)
```bash
cd central-repo
npm run test:mock
```

**Expected Output:**
```
  FHECounter
    ✔ encrypted count should be uninitialized after deployment
    ✔ increment the counter by 1
    ✔ decrement the counter by 1

  Encrypted Arithmetic Operations (4 tests passing)
  Encrypted State Management (7 tests passing)
  fhEVM Mock Test Infrastructure (17 tests passing)
  Smoke tests (5 tests passing)

36 passing (1s)
```

### 2. Run Specific Test
```bash
npx hardhat test test/FHECounter.cjs
```

### 3. Debug with Stack Traces
```bash
npx hardhat test --show-stack-traces test/EncryptedArithmetic.cjs
```

---

## Key Files

| File | Purpose |
|------|---------|
| `hardhat.config.cjs` | Main Hardhat configuration |
| `contracts/FHECounter.sol` | Mock counter contract |
| `test/FHECounter.cjs` | Core counter tests (3) |
| `test/EncryptedArithmetic.cjs` | Arithmetic tests (4) |
| `test/EncryptedStateMgmt.cjs` | State management tests (7) |
| `test/MockInfrastructure.cjs` | Infrastructure tests (17) |
| `test/helpers/fhevm-mock.js` | Mock fhEVM gateway |

---

## Test Environment

- **Node.js:** v20.19.6 ✓
- **npm:** 10.8.2 ✓
- **Hardhat:** 2.22.2 ✓
- **ethers.js:** 6.16.0 ✓

### Verify Setup
```bash
cd central-repo
node --version      # Should be v20.19.6
npm --version       # Should be 10.x.x
npx hardhat --version  # Should be 2.22.2
```

---

## Common Commands

```bash
# Run all mocked tests
npm run test:mock

# Run with Hardhat directly
MOCK=true npx hardhat test

# Compile contracts
npx hardhat compile

# List available tasks
npx hardhat help

# Run single test file
npx hardhat test test/FHECounter.cjs

# Run with debugging
npx hardhat test --show-stack-traces
```

---

## Creating New Tests

### Template
```javascript
// test/MyTest.cjs
const { expect } = require("chai");

let ethers;
let hre;
let fhevm;

describe("My Test Suite", function () {
  before(async function () {
    hre = (typeof global !== "undefined" && global.hre) 
      || (await import("hardhat")).default;
    ethers = hre.ethers || (await import("ethers"));
    fhevm = hre.fhevm || (await import("./helpers/fhevm-mock.js")).default;
  });

  it("should do something", async function () {
    const signers = await ethers.getSigners();
    const contract = await ethers.getContractFactory("FHECounter").then(f => f.deploy());
    
    // Your test code
    expect(true).to.be.true;
  });
});
```

### Important Notes
- Use `.cjs` file extension (CommonJS format)
- Import Hardhat runtime in `before()` hook
- Always get ethers from `hre.ethers`
- Use mock fhevm gateway for encryption

---

## Mock fhEVM Gateway API

### Create Encrypted Input
```javascript
const encrypted = await fhevm
  .createEncryptedInput(contractAddress, userAddress)
  .add32(42)
  .encrypt();

// Result: { handles: [handle], inputProof: proof }
```

### Decrypt Value
```javascript
const decrypted = await fhevm.userDecryptEuint(
  { euint32: 0 },
  encryptedValue,
  contractAddress,
  signer
);
```

### Check Mock Mode
```javascript
if (fhevm.isMock) {
  console.log("Running in mock mode");
}
```

---

## Test Results Summary

**Total Tests:** 36
**Passing:** 36 ✅
**Failing:** 0
**Execution Time:** ~1 second
**Coverage Areas:**
- ✅ Counter operations (increment/decrement)
- ✅ Encrypted input creation
- ✅ Mock gateway functionality
- ✅ Multi-signer operations
- ✅ Contract deployment
- ✅ Encryption/decryption cycles

---

## Architecture Overview

```
User Test → Hardhat Runtime → ethers.js
                                    ↓
                          Mock fhEVM Gateway
                          - createEncryptedInput()
                          - userDecryptEuint()
                                    ↓
                          FHECounter.sol (deployed)
                                    ↓
                          Test Assertions
```

---

## Troubleshooting

### Tests fail with "ethers undefined"
```bash
# Solution: Check hardhat.config.cjs is present
ls hardhat.config.cjs

# Solution: Verify no conflicting config files
rm -f hardhat.config.ts hardhat.config.js
```

### Node version issues
```bash
# Check version (must be v20.x)
node --version

# If using nvm:
nvm install 20
nvm use 20
npm install
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Contract compilation issues
```bash
# Clean and recompile
rm -rf artifacts cache
npx hardhat compile
```

---

## Next Steps

1. ✅ **Current:** Run mocked tests
2. 📋 **Next:** Add your own test contracts
3. 🔧 **Then:** Extend mock gateway for new types
4. 🚀 **Finally:** Deploy to Sepolia testnet

---

## Documentation

For detailed information, see:
- `central-repo/MOCKED_TEST_SUITE.md` - Comprehensive documentation
- `contracts/FHECounter.sol` - Contract implementation
- `test/helpers/fhevm-mock.js` - Mock gateway source code

---

## Commands at a Glance

```bash
# Main commands
cd central-repo
npm run test:mock                          # Run all tests
npx hardhat test test/FHECounter.cjs      # Run one test file
npx hardhat compile                        # Compile contracts
npx hardhat run scripts/deploy.js          # Run deployment

# Debugging
npx hardhat test --show-stack-traces
npx hardhat test --grep "should increment"
npx hardhat node                           # Start local node

# Cleanup
rm -rf artifacts cache node_modules
npm install
```

---

**Status:** ✅ Ready for Development
**Last Updated:** December 28, 2025
**Test Suite:** 36/36 Passing
