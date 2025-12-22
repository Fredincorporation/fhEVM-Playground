# fhEVM Playground Pro - Examples Index

Complete reference guide for all 24 example categories, organized by complexity level and learning path.

## Table of Contents

- [Beginner (3 examples)](#beginner-examples)
- [Intermediate (9 examples)](#intermediate-examples)
- [Advanced (5 examples)](#advanced-examples)
- [Expert (7 examples - PRO)](#expert-examples-pro)
- [Learning Paths](#learning-paths)
- [Quick Stats](#quick-stats)

---

## Beginner Examples

Perfect starting point for learning fhEVM fundamentals.

### 1. Basic Counter

**Category**: `basic-counter`  
**Complexity**: ⭐ Beginner  
**Pro**: No  
**Keywords**: `counter`, `state`, `increment`, `decrement`, `first-example`

**Description**: The simplest fhEVM contract - an encrypted counter that can be incremented or decremented. Learn the basics of storing and modifying encrypted state.

**What You'll Learn**:
- How to declare encrypted state variables (`euint32`)
- Basic encrypted arithmetic operations
- Function access patterns for encrypted state
- Writing first fhEVM tests

**Contract Overview**:
```solidity
contract BasicCounter {
  euint32 private encryptedCounter;
  
  function increment() external {
    encryptedCounter = TFHE.add(encryptedCounter, 1);
  }
  
  function decrement() external {
    encryptedCounter = TFHE.sub(encryptedCounter, 1);
  }
}
```

**Use Cases**: Starting template, proof of concept, minimal viable fhEVM contract

---

### 2. Arithmetic

**Category**: `arithmetic`  
**Complexity**: ⭐ Beginner  
**Pro**: No  
**Keywords**: `add`, `subtract`, `multiply`, `division`, `operations`

**Description**: Demonstrates arithmetic operations on encrypted values using homomorphic encryption. Covers addition, subtraction, and multiplication of euint types.

**What You'll Learn**:
- TFHE.add(), TFHE.sub(), TFHE.mul() operations
- Operating on encrypted integers
- Return encrypted results
- Combining multiple operations

**Contract Overview**:
```solidity
contract Arithmetic {
  function add(euint32 a, euint32 b) external pure returns (euint32) {
    return TFHE.add(a, b);
  }
  
  function subtract(euint32 a, euint32 b) external pure returns (euint32) {
    return TFHE.sub(a, b);
  }
  
  function multiply(euint32 a, euint32 b) external pure returns (euint32) {
    return TFHE.mul(a, b);
  }
}
```

**Use Cases**: Educational, internal functions, protocol math operations

---

### 3. Comparisons

**Category**: `comparisons`  
**Complexity**: ⭐ Beginner  
**Pro**: No  
**Keywords**: `greater-than`, `less-than`, `equality`, `comparisons`, `ebool`

**Description**: Master comparison operations on encrypted data. Learn how to use homomorphic comparisons (gt, lt, eq, le, ge) that return encrypted booleans.

**What You'll Learn**:
- TFHE.gt(), TFHE.lt(), TFHE.eq() operations
- Working with ebool encrypted booleans
- Conditional logic on encrypted values
- Return encrypted boolean results

**Contract Overview**:
```solidity
contract Comparisons {
  function isGreaterThan(euint32 a, euint32 b) external pure returns (ebool) {
    return TFHE.gt(a, b);
  }
  
  function isEqual(euint32 a, euint32 b) external pure returns (ebool) {
    return TFHE.eq(a, b);
  }
  
  function isLessThan(euint32 a, euint32 b) external pure returns (ebool) {
    return TFHE.lt(a, b);
  }
}
```

**Use Cases**: Threshold checks, conditional logic, privacy-preserving validation

---

## Intermediate Examples

Building on fundamentals - add encryption, decryption, and access control patterns.

### 4. Single Encryption (User-Side)

**Category**: `single-encryption`  
**Complexity**: 🟡 Intermediate  
**Pro**: No  
**Keywords**: `encryption`, `user-side`, `input-encryption`, `gateway`

**Description**: Learn how users encrypt data before sending to contracts. Demonstrates input encryption patterns using the fhEVM gateway.

**What You'll Learn**:
- Client-side encryption using fhEVM gateway
- Sending encrypted inputs to contracts
- Handling encrypted function parameters
- Gas optimization for encrypted inputs

**Test Pattern**:
```typescript
const { signature, plaintext, ciphertext } = 
  await getSignatureAndEncryption(gateway, toEncrypt);

const tx = await contract.processEncrypted(
  ciphertext,
  signature
);
```

**Use Cases**: User-submitted data, private inputs, enrollment functions

---

### 5. Multiple Encryption (Batch)

**Category**: `multiple-encryption`  
**Complexity**: 🟡 Intermediate  
**Pro**: No  
**Keywords**: `batch-encryption`, `multiple-inputs`, `aggregation`

**Description**: Handle multiple encrypted inputs and perform operations on batches of encrypted data.

**What You'll Learn**:
- Encrypting multiple values
- Batch processing of encrypted data
- Efficient aggregation patterns
- Handling variable input sizes

**Use Cases**: Voting systems, batch payments, data aggregation

---

### 6. Single Decryption (User-Authorized)

**Category**: `single-decryption-user`  
**Complexity**: 🟡 Intermediate  
**Pro**: No  
**Keywords**: `decryption`, `user-authorized`, `reencryption`, `access-control`

**Description**: User-authorized decryption pattern. Only the data owner can decrypt results using FHE.allow().

**What You'll Learn**:
- FHE.allow() for user decryption authorization
- Reencryption patterns
- Access control for decryption
- Privacy-preserving result retrieval

**Contract Pattern**:
```solidity
// Allow user to decrypt the result
FHE.allow(result, msg.sender);
return result;
```

**Use Cases**: Personal data access, selective disclosure, user queries

---

### 7. Single Decryption (Public)

**Category**: `single-decryption-public`  
**Complexity**: 🟡 Intermediate  
**Pro**: No  
**Keywords**: `public-decryption`, `transparent`, `unsealing`, `threshold`

**Description**: Public decryption for transparent operations where results must be disclosed to all participants.

**What You'll Learn**:
- Public decryption (no FHE.allow() needed)
- Transparent operations
- Unsealing encrypted values
- When to use public vs. user decryption

**Use Cases**: Public verification, transparent protocols, on-chain aggregation

---

### 8. Multiple Decryption (Batch)

**Category**: `multiple-decryption`  
**Complexity**: 🟡 Intermediate  
**Pro**: No  
**Keywords**: `batch-decryption`, `efficiency`, `multi-user`, `aggregation`

**Description**: Efficiently decrypt multiple values in batch operations.

**What You'll Learn**:
- Efficient batch decryption patterns
- Combining multiple decrypted values
- Gas optimization for decryption
- Handling mixed encrypted/plaintext

**Use Cases**: Settlements, distributions, bulk data queries

---

### 9. Access Control

**Category**: `access-control`  
**Complexity**: 🟡 Intermediate  
**Pro**: No  
**Keywords**: `permissions`, `roles`, `authorization`, `encrypted-permissions`

**Description**: Implement role-based access control with encrypted permissions.

**What You'll Learn**:
- Storing permissions encrypted
- Role-based authorization checks
- Comparing encrypted permissions
- Protecting sensitive operations

**Contract Pattern**:
```solidity
euint8 private encryptedPermissions;

function hasPermission(uint8 requiredRole) 
  external view returns (ebool) {
  return TFHE.ge(encryptedPermissions, requiredRole);
}
```

**Use Cases**: Admin functions, multi-signature operations, privileged access

---

## Advanced Examples

Complex patterns combining multiple fhEVM features.

### 10. Input Verification Proofs

**Category**: `input-verification-proofs`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `validation`, `proofs`, `constraints`, `homomorphic-verification`

**Description**: Verify encrypted inputs meet certain constraints without decryption using homomorphic comparisons.

**What You'll Learn**:
- Validating encrypted inputs
- Constraint checking on private data
- Homomorphic verification
- Returning verification results

**Example**:
```solidity
// Verify value is between 1 and 100 without decryption
ebool minCheck = TFHE.gt(value, 0);
ebool maxCheck = TFHE.lt(value, 101);
ebool isValid = TFHE.and(minCheck, maxCheck);
```

**Use Cases**: Input validation, constraint enforcement, privacy-preserving verification

---

### 11. Anti-Patterns Guide

**Category**: `anti-patterns-guide`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `best-practices`, `pitfalls`, `security`, `gas-optimization`, `education`

**Description**: Educational guide showing common mistakes and how to avoid them in fhEVM contracts.

**What You'll Learn**:
- Common fhEVM pitfalls
- Security anti-patterns
- Gas inefficiencies
- Why certain patterns fail
- Correct alternatives

**Topics Covered**:
- Decrypting unnecessarily
- Inefficient loops with encrypted state
- Access control mistakes
- Type mismatches
- Gas optimization failures

**Use Cases**: Learning resource, code review checklist, best practices reference

---

### 12. Handles Lifecycle

**Category**: `handles-lifecycle`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `handles`, `lifecycle`, `state-management`, `encryption-handles`

**Description**: Manage encrypted values through their complete lifecycle using handles.

**What You'll Learn**:
- What are encrypted handles
- Creating handles from encrypted values
- Persisting handles
- Reconstructing from handles
- Lifecycle management patterns

**Use Cases**: State machines, complex protocols, multi-step operations

---

### 13. OpenZeppelin ERC20 Wrapper

**Category**: `oz-erc20-wrapper`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `erc20`, `openzeppelin`, `wrapper`, `token-privacy`

**Description**: Create a privacy-preserving ERC20 wrapper pattern using fhEVM.

**What You'll Learn**:
- Wrapping OpenZeppelin ERC20
- Encrypted balance tracking
- Private transfer patterns
- Token standards compliance

**Contract Pattern**:
```solidity
contract PrivateERC20 is ERC20 {
  mapping(address => euint64) private encryptedBalances;
  
  function transferEncrypted(
    address to, 
    uint64 amount
  ) external {
    // Encrypted transfer logic
  }
}
```

**Use Cases**: Privacy tokens, confidential payments, hidden balances

---

### 14. OpenZeppelin ERC7984 (Modular)

**Category**: `oz-erc7984-basic`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `erc7984`, `modular`, `delegated-execution`, `advanced-token`

**Description**: Implement modular token functionality using ERC7984 draft standard with fhEVM integration.

**What You'll Learn**:
- ERC7984 modular architecture
- Delegated execution patterns
- Module composition
- Advanced token mechanics

**Use Cases**: Advanced token standards, delegated operations, modular protocols

---

### 15. Swaps (AMM Pattern)

**Category**: `swaps`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `amm`, `automated-market-maker`, `liquidity`, `price`, `swaps`

**Description**: Implement a basic Automated Market Maker (AMM) with encrypted reserves.

**What You'll Learn**:
- AMM mechanics (x*y=k constant product formula)
- Private liquidity tracking
- Encrypted price computation
- Slippage protection with encrypted values

**Contract Pattern**:
```solidity
euint64 private encryptedReserveA;
euint64 private encryptedReserveB;

function swap(uint64 amountIn) external {
  // Encrypted swap logic
}
```

**Use Cases**: Decentralized exchanges, liquidity pools, trading protocols

---

### 16. Vesting

**Category**: `vesting`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `token-vesting`, `release-schedule`, `time-locked`, `cliff`

**Description**: Time-locked token vesting with encrypted amounts.

**What You'll Learn**:
- Vesting schedules
- Time-locked releases
- Cliff periods
- Encrypted amount tracking

**Contract Pattern**:
```solidity
struct VestingSchedule {
  uint64 startTime;
  uint64 duration;
  euint64 totalAmount;
  euint64 releasedAmount;
}
```

**Use Cases**: Token distribution, employee compensation, gradual unlocks

---

### 17. Blind Auction

**Category**: `blind-auction`  
**Complexity**: 🔴 Advanced  
**Pro**: No  
**Keywords**: `auction`, `blind-bidding`, `sealed-bids`, `privacy`, `price-discovery`

**Description**: Privacy-preserving auction where bids remain hidden until revelation.

**What You'll Learn**:
- Sealed-bid auction mechanics
- Encrypted bid storage
- Bid revelation patterns
- Winner determination with encryption
- Privacy during bidding

**Contract Pattern**:
```solidity
struct EncryptedBid {
  address bidder;
  euint64 amount;
  ebool revealed;
}

mapping(uint256 => EncryptedBid[]) private bids;
```

**Use Cases**: Sealed-bid auctions, confidential pricing, fair price discovery

---

## Expert Examples (PRO)

Advanced real-world protocols. PRO bonus examples showcasing sophisticated patterns.

### 18. DAO Voting (PRO)

**Category**: `dao-voting-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `dao`, `voting`, `homomorphic-tallying`, `privacy`, `governance`

**Description**: Privacy-preserving DAO voting with encrypted votes and homomorphic result tallying.

**What You'll Learn**:
- Encrypted voting mechanics
- Homomorphic tallying (counting votes while encrypted)
- Vote delegation with privacy
- Governance without vote exposure
- Result unsealing and verification

**Advanced Features**:
- Privacy-preserving vote counting
- Delegation patterns
- Multi-proposal handling
- Quorum checks on encrypted votes

**Use Cases**: Governance tokens, decentralized decisions, private voting DAOs

---

### 19. Private Lending (PRO)

**Category**: `private-lending-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `lending`, `protocol`, `collateral`, `privacy`, `interest`

**Description**: Confidential lending protocol with encrypted collateral, amounts, and interest.

**What You'll Learn**:
- Encrypted loan tracking
- Private collateral management
- Interest calculation on encrypted values
- Liquidation logic with privacy
- Multi-asset support

**Advanced Features**:
- Encrypted health factor computation
- Private liquidation auctions
- Risk management on encrypted data
- Loan portfolio privacy

**Use Cases**: Privacy-preserving lending, confidential credit facilities

---

### 20. Blind DEX (PRO)

**Category**: `blind-dex-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `dex`, `trading`, `orders`, `mev-resistant`, `encrypted-matching`

**Description**: MEV-resistant decentralized exchange with encrypted order books.

**What You'll Learn**:
- Order matching with privacy
- MEV-resistant order execution
- Encrypted order books
- Price discovery without exposure
- Fair order execution

**Advanced Features**:
- Encrypted limit orders
- Fair price matching algorithms
- MEV prevention
- Batch settlement
- Private market insights

**Use Cases**: MEV-resistant trading, fair price discovery, encrypted markets

---

### 21. Encrypted Poker (PRO)

**Category**: `encrypted-poker-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `poker`, `game`, `cards`, `privacy`, `commitment`

**Description**: On-chain poker game with encrypted hands and fair dealing.

**What You'll Learn**:
- Card encryption and shuffling
- Hand secrecy during play
- Fair dealing verification
- Encrypted hand comparison
- Game state management

**Advanced Features**:
- Encrypted deck management
- Private hand evaluation
- Fair betting with privacy
- Dispute resolution
- Game state commitments

**Use Cases**: On-chain gaming, privacy-preserving games

---

### 22. Private Yield Farming (PRO)

**Category**: `private-yield-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `yield-farming`, `rewards`, `privacy`, `staking`, `apr`

**Description**: Yield farming protocol with encrypted deposit amounts and yields.

**What You'll Learn**:
- Encrypted yield tracking
- Private APY computation
- Reward distribution with privacy
- Encrypted stake management
- Multi-pool support

**Advanced Features**:
- Privacy-preserving APY calculations
- Encrypted reward compounding
- Multi-token farming
- Dynamic rate adjustments
- Slashing with privacy

**Use Cases**: Privacy yield protocols, confidential staking

---

### 23. MEV Arbitrage (PRO)

**Category**: `mev-arbitrage-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `mev`, `arbitrage`, `price-monitoring`, `fair-execution`, `privacy`

**Description**: Detect and execute arbitrage opportunities while maintaining order privacy.

**What You'll Learn**:
- Price monitoring on encrypted data
- Private arbitrage detection
- Fair execution mechanisms
- MEV capture with privacy
- Cross-exchange patterns

**Advanced Features**:
- Encrypted price feeds
- Private spread calculation
- Safe MEV capture
- Batch execution
- Slippage management

**Use Cases**: Private arbitrage strategies, MEV-fair protocols

---

### 24. Confidential Stablecoin (PRO)

**Category**: `confidential-stablecoin-pro`  
**Complexity**: ⭐⭐⭐ Expert  
**Pro**: Yes  
**Keywords**: `stablecoin`, `collateral`, `mint-burn`, `privacy`, `stability`

**Description**: Privacy-preserving stablecoin with encrypted collateral and minting mechanics.

**What You'll Learn**:
- Encrypted collateral tracking
- Private mint/burn operations
- Collateral ratio checking without exposure
- Peg maintenance with privacy
- Emergency shutdown patterns

**Advanced Features**:
- Privacy-preserving collateral ratios
- Encrypted reserve management
- Confidential liquidations
- Multi-collateral support
- Governance integration

**Use Cases**: Privacy stablecoins, confidential payment tokens

---

## Learning Paths

### Path 1: Fundamentals (3 examples)

1. **Basic Counter** - Learn encrypted state
2. **Arithmetic** - Learn operations
3. **Comparisons** - Learn conditional logic

**Estimated Time**: 2-3 hours  
**Goal**: Understand core fhEVM operations

---

### Path 2: Encryption & Decryption (5 examples)

1. Basic Counter (from Path 1)
2. **Single Encryption** - User-side encryption
3. **Single Decryption (User)** - User authorization
4. **Single Decryption (Public)** - Transparent ops
5. **Multiple Decryption** - Batch patterns

**Estimated Time**: 5-6 hours  
**Goal**: Master encryption/decryption patterns

---

### Path 3: Security & Access (3 examples)

1. **Access Control** - Role-based permissions
2. **Input Verification** - Constraint validation
3. **Anti-Patterns Guide** - What to avoid

**Estimated Time**: 4 hours  
**Goal**: Write secure fhEVM contracts

---

### Path 4: DeFi Protocols (8 examples)

1. All fundamentals from Path 1
2. **ERC20 Wrapper** - Token standards
3. **Swaps** - AMM mechanics
4. **Vesting** - Time-locked releases
5. **Blind Auction** - Privacy auctions
6. **Private Lending** - Advanced protocol
7. **Blind DEX** - MEV resistance
8. **Confidential Stablecoin** - Full protocol

**Estimated Time**: 20-25 hours  
**Goal**: Build production DeFi protocols

---

### Path 5: Expert Mastery (All 24 examples)

Complete all learning paths, then:
- **DAO Voting** - Governance
- **Encrypted Poker** - Gaming
- **Private Yield** - Advanced economics
- **MEV Arbitrage** - Advanced trading

**Estimated Time**: 40-50 hours  
**Goal**: Expertise across all fhEVM patterns

---

## Quick Stats

| Metric | Count |
|--------|-------|
| **Total Categories** | 24 |
| **Beginner** | 3 |
| **Intermediate** | 9 |
| **Advanced** | 5 |
| **Expert/PRO** | 7 |
| **Total Contracts** | 24 |
| **Total Tests** | 24 |
| **Total READMEs** | 24 |
| **Lines of Solidity** | ~1,200 |
| **Lines of Tests** | ~1,600 |
| **Keywords Covered** | 80+ |

---

## Complexity Distribution

```
Beginner     ███          (3 / 24)
Intermediate ██████       (9 / 24)
Advanced     █████        (5 / 24)
Expert/PRO   ███████      (7 / 24)
```

## By Category

- **State Management**: Basic Counter, Handles Lifecycle
- **Arithmetic**: Arithmetic, Swaps (AMM)
- **Comparisons**: Comparisons, Input Verification, Blind Auction
- **Encryption/Decryption**: All Single/Multiple variants
- **Access Control**: Access Control, DAO Voting
- **Tokens**: ERC20 Wrapper, ERC7984, Confidential Stablecoin
- **Finance**: Lending, Yield Farming, DEX, Swaps
- **Gaming**: Poker, Blind Auction
- **MEV**: Blind DEX, MEV Arbitrage
- **Education**: Anti-Patterns Guide

---

## Getting Started

### Start Here
1. Read [README.md](./README.md) for overview
2. Run `npx create-fhevm-playground-pro list` to see all categories
3. Create your first example: `npx create-fhevm-playground-pro create --name my-counter --category basic-counter`
4. Follow Learning Path 1 (Fundamentals)

### Next Steps
- Pick a learning path that matches your interests
- Create each example in sequence
- Study the generated contracts
- Modify and experiment
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to create your own

### Resources
- [fhEVM Official Docs](https://docs.zama.ai/fhevm)
- [TFHE.sol API Reference](https://github.com/zama-ai/fhevm)
- [Architecture Guide](./ARCHITECTURE.md) - How the system works

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Maintained By**: fhEVM Playground Pro Team
