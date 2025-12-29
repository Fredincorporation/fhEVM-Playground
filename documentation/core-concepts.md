# Core Concepts

Understand the fundamental ideas behind fhEVM and FHE smart contracts.

## What is Fully Homomorphic Encryption (FHE)?

Fully Homomorphic Encryption allows you to:
- **Perform computations on encrypted data** without decrypting it
- **Preserve privacy** — data stays encrypted end-to-end
- **Verify results** — get cryptographically proven outputs

### Example: Encrypted Counter

```
Plaintext world:
  count = 5
  count += 1  → count = 6 (visible to everyone)

FHE world:
  encryptedCount = E(5)  — only you know it's 5
  encryptedCount +=1     — no one can see the value
  result = D(encryptedCount) → 6 (only you can decrypt)
```

## Key Concepts

### Encrypted Types (euint*)
Variables that hold encrypted values:
- `euint8` — 8-bit encrypted integer
- `euint16` — 16-bit encrypted integer
- `euint32` — 32-bit encrypted integer
- `euint64` — 64-bit encrypted integer

**Property**: Operations produce encrypted results (no information leakage)

### Homomorphic Operations
Operations you can perform on encrypted data:
- **Arithmetic**: `add`, `sub`, `mul`, `div`
- **Comparisons**: `eq`, `lt`, `gt`, `le`, `ge`
- **Bitwise**: `and`, `or`, `xor`, `not`
- **Selection**: `select`, `mux`

### The TFHE Library
The `TFHE` (Threshold Fully Homomorphic Encryption) library provides:
```solidity
import "./fhevm/lib/TFHE.sol";

// Operations
TFHE.add(a, b)        // Encrypted addition
TFHE.eq(a, b)         // Encrypted equality test
TFHE.select(cond, a, b) // If-then-else on encrypted values
```

## Use Cases

### 1. Confidential Finance
- Private balances and transactions
- Encrypted loan portfolios
- Confidential trading

### 2. Voting & Governance
- Private ballot casting
- Encrypted vote tallying
- Anonymous participation

### 3. Gaming
- Hidden card games (poker, etc.)
- Encrypted game state
- MEV-resistant mechanics

### 4. Access Control
- Encrypted permissions
- Private attribute verification
- Role-based access without exposure

## How fhEVM Works

1. **User encrypts data** with their public key
2. **Smart contract processes encrypted data** using TFHE operations
3. **Results stay encrypted** in the contract
4. **User decrypts results** with their private key

```
User's Device:
  plaintext = 42
  encrypted = encrypt(plaintext, publicKey)  → 0xb3f2a...

Blockchain:
  contract.process(encrypted)
  result = encrypted + encrypted  → 0x1f9c2...

User's Device:
  decrypted = decrypt(result, privateKey)  → 84
```

## Privacy Properties

### What's Hidden
- The value of encrypted variables
- Intermediate computation results
- Conditional branch taken (in encrypted conditionals)

### What's Visible
- Smart contract logic (code is public)
- Function calls and their addresses
- Gas costs and transaction metadata

## Performance Considerations

### Mocked Mode (Testing)
- Fast for development
- Doesn't use real FHE
- Perfect for testing logic

### Live Mode (Testnet/Production)
- Actual FHE computations
- Higher gas costs
- Complete privacy guarantees

## Common Patterns

### Encrypted State Variables
```solidity
euint32 private balance;  // Only owner knows the value
```

### Encrypted Conditionals
```solidity
bool isEligible = TFHE.decrypt(TFHE.gt(balance, threshold));
if (isEligible) { /* ... */ }
```

### Batch Operations
```solidity
result = TFHE.add(TFHE.mul(a, b), TFHE.mul(c, d));
```

## Next Steps

- [FHE Fundamentals](fhe-fundamentals.md) — Deeper technical dive
- [fhEVM Architecture](architecture.md) — System design and components
- [Building Your First Contract](building-first-contract.md) — Hands-on coding
