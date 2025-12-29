# Walkthroughs

Step-by-step guides for common FHE development tasks.

## Testing with Mocked Mode

Learn how to write and run comprehensive tests for your FHE contracts without using real FHE operations.

### Why Mocked Mode?
- **Speed**: Tests run instantly (milliseconds)
- **Simplicity**: No FHE infrastructure needed
- **Cost**: No blockchain fees or computation costs
- **Debugging**: Easy to inspect intermediate values

### Basic Test Structure

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { TFHE } from "./fhevm/types";

describe("MyContract", function () {
    let contract: MyContract;
    let account: SignerWithAddress;

    beforeEach(async function () {
        [account] = await ethers.getSigners();
        const MyContract = await ethers.getContractFactory("MyContract");
        contract = await MyContract.deploy();
        await contract.deployed();
    });

    it("should increment encrypted counter", async function () {
        const initialCount = 0;
        const encrypted = await contract.getCount();
        expect(encrypted).to.equal(initialCount);

        await contract.increment();
        const newCount = await contract.getCount();
        expect(newCount).to.equal(initialCount + 1);
    });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test test/Counter.test.ts

# Run with verbose output
npm test -- --reporter spec
```

## Deploying to Testnet

Deploy your FHE contract to a live testnet for real FHE computations.

### Prerequisites
- Testnet funds (ETH for gas)
- Private key (safely stored in `.env`)
- Testnet RPC URL

### Deployment Script

```solidity
async function main() {
    const MyContract = await ethers.getContractFactory("MyContract");
    const contract = await MyContract.deploy();
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

### Deploy Command

```bash
npm run deploy:testnet
```

## Building Your First Confidential App

A complete walkthrough from concept to deployment.

### 1. Define Your Requirements
- What data should be private?
- What operations are needed?
- Who are the participants?

### 2. Design the Contract
```solidity
contract ConfidentialVault {
    mapping(address => euint32) private balances;
    
    function deposit(bytes calldata encryptedAmount) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        balances[msg.sender] = TFHE.add(
            balances[msg.sender], 
            amount
        );
    }
    
    function withdraw(bytes calldata encryptedAmount) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        require(
            TFHE.decrypt(
                TFHE.ge(balances[msg.sender], amount)
            ),
            "Insufficient balance"
        );
        balances[msg.sender] = TFHE.sub(
            balances[msg.sender], 
            amount
        );
    }
}
```

### 3. Write Tests
```typescript
it("should handle deposits correctly", async function () {
    const encryptedAmount = encryptFHE(100);
    await contract.deposit(encryptedAmount);
    // Verify state changed
});
```

### 4. Deploy and Test on Testnet
```bash
npm run deploy:testnet
```

## Next Steps

- [Building Your First Contract](building-first-contract.md) — Detailed code walkthrough
- [Security & Best Practices](security.md) — Ensure your code is secure
- [Troubleshooting](troubleshooting.md) — Common issues and fixes
