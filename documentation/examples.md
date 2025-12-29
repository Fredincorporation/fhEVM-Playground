# Examples Index

Browse and learn from 21 pre-built FHE examples.

## Core Concepts (Mandatory Examples)

These examples teach fundamental FHE patterns used in all contracts.

### 1. Basic Counter
**Category**: `basic-counter`

A simple encrypted counter that demonstrates:
- Encrypted state variables
- Basic addition operations
- Mocked testing

### 2. Arithmetic Operations
**Category**: `arithmetic-premium`

Encrypted arithmetic with add, subtract, multiply, and divide operations.

### 3. Comparisons & Inequalities
**Category**: `comparisons`

Using encrypted comparison operators (eq, lt, gt, le, ge).

### 4. User/Public Encryption & Decryption
**Category**: `user-encryption`

Managing encryption/decryption workflows for user inputs and contract outputs.

### 5. Access Control (FHE.allow)
**Category**: `access-control`

Implementing encrypted permission checks and role-based access.

### 6. Input Proofs & Verification
**Category**: `input-proofs`

Validating and proving encrypted inputs without decryption.

### 7. Anti-Patterns & Edge Cases
**Category**: `anti-patterns`

Learning what NOT to do in FHE contracts.

### 8. Handles & Lifecycle Management
**Category**: `handles`

Managing encrypted data lifecycles and handle operations.

### 9. Symbolic Execution & Analysis
**Category**: `symbolic-execution`

Advanced analysis and verification of encrypted computations.

### 10. OpenZeppelin Standards (ERC-7984, Wrappers, Swaps, Vesting)
**Category**: `erc-standards`

Integrating FHE with standard contract patterns.

### 11. Blind Auction
**Category**: `blind-auction`

Confidential bidding system where bids remain encrypted.

## Real-World Applications (Pro/Bonus Examples)

Advanced applications showing practical use cases.

### 12. Confidential DAO Voting
**Category**: `confidential-dao`

Private voting system where votes are encrypted until reveal.

### 13. Private Lending Pool
**Category**: `private-lending`

Confidential lending protocol with encrypted collateral and debt.

### 14. Blind DEX Order Book (MEV-Resistant)
**Category**: `blind-dex`

Encrypted order book preventing MEV attacks through FHE.

### 15. Encrypted Poker Game
**Category**: `encrypted-poker`

Confidential card game with hidden hands and encrypted game state.

### 16. Private Yield Farming
**Category**: `yield-farming`

Confidential yield farming positions and rewards.

### 17. MEV-Resistant Arbitrage
**Category**: `mev-arbitrage`

Privacy-preserving arbitrage demonstration using FHE.

### 18. Confidential Stablecoin
**Category**: `stablecoin`

Private stablecoin with encrypted balances and transfers.

### 19-21. Additional Examples
More examples coming soon demonstrating:
- Confidential analytics
- Private identity systems
- Encrypted data markets

## How to Use Examples

### View Source Code
Each example is available as a standalone Hardhat project:

```bash
create-fhevm-playground-pro create --name my-voting --category confidential-dao
cd my-voting
cat contracts/*.sol
```

### Run Tests
```bash
npm install
npm test
```

### Modify & Experiment
```bash
# Edit the contract
nano contracts/MyContract.sol

# Run your tests
npm test

# Deploy to testnet
npm run deploy:testnet
```

## Learning Path

**Beginner** → Start with:
1. Basic Counter
2. Arithmetic Operations
3. Comparisons

**Intermediate** → Continue with:
4. Access Control
5. Input Proofs
6. Blind Auction

**Advanced** → Explore:
7. Confidential DAO
8. Private Lending
9. Blind DEX

## Browse All Categories

```bash
# See all available categories
create-fhevm-playground-pro create --name test --help
```

## Next Steps

- [Building Your First Contract](building-first-contract.md) — Learn by doing
- [CLI Commands Reference](cli-commands.md) — All scaffolder options
- [Walkthroughs](walkthroughs.md) — Step-by-step guides
