# FHE Fundamentals

A deeper technical dive into Fully Homomorphic Encryption.

## Homomorphic Encryption Overview

Homomorphic encryption is a type of encryption that allows computation on ciphertexts, producing an encrypted result that, when decrypted, matches the result of operations on the plaintext.

### Four Types of Homomorphic Encryption

1. **Partial Homomorphic Encryption (PHE)**
   - Supports either addition OR multiplication (not both)
   - Example: RSA (supports multiplication)

2. **Somewhat Homomorphic Encryption (SHE)**
   - Supports both addition and multiplication
   - Limited number of operations (ciphertext noise grows)
   - Example: BGV scheme

3. **Leveled Fully Homomorphic Encryption (LFHE)**
   - Supports unlimited operations at a fixed depth
   - Noise grows, but within bounds

4. **Fully Homomorphic Encryption (FHE)**
   - Supports unlimited operations of unlimited depth
   - Bootstrapping allows noise reduction
   - Most general and most expensive

## TFHE Scheme (Used by fhEVM)

fhEVM uses TFHE (Threshold Fully Homomorphic Encryption) by Zama.

### Key Properties
- **Supports**: Addition, multiplication, comparisons, all bitwise operations
- **Bootstrapping**: Fast (milliseconds), unlike older FHE schemes
- **Noise**: Grows with operations but bootstrapping resets it
- **Encryption**: Uses threshold secret sharing for security

### Security Level
- 128-bit security (meets industry standards)
- Resistant to known quantum algorithms
- Based on RLWE (Ring Learning with Errors) problem

## Homomorphic Operations

### Basic Arithmetic
```solidity
auint32 a = ..., b = ...;

auint32 sum = TFHE.add(a, b);        // a + b
auint32 diff = TFHE.sub(a, b);       // a - b
auint32 prod = TFHE.mul(a, b);       // a * b
auint32 quot = TFHE.div(a, b);       // a / b (floor)
auint32 rem = TFHE.rem(a, b);        // a % b
```

### Comparisons
```solidity
bool isEqual = TFHE.decrypt(TFHE.eq(a, b));
bool isLess = TFHE.decrypt(TFHE.lt(a, b));
bool isGreater = TFHE.decrypt(TFHE.gt(a, b));
bool isLE = TFHE.decrypt(TFHE.le(a, b));
bool isGE = TFHE.decrypt(TFHE.ge(a, b));
```

### Bitwise Operations
```solidity
auint32 andResult = TFHE.and(a, b);     // Bitwise AND
auint32 orResult = TFHE.or(a, b);       // Bitwise OR
auint32 xorResult = TFHE.xor(a, b);     // Bitwise XOR
auint32 notResult = TFHE.not(a);        // Bitwise NOT
```

### Conditional Selection
```solidity
auint32 result = TFHE.select(condition, valueIfTrue, valueIfFalse);
```

## Encryption and Decryption

### User-Side
```typescript
// Client: Encrypt user's private key
const publicKey = fhevmUtils.generatePublicKey();
const privateKey = fhevmUtils.generatePrivateKey();

// Encrypt sensitive data
const encryptedValue = publicKey.encrypt(42);
const encryptedBalance = publicKey.encrypt(1000);

// Send to contract (no plaintext exposed)
await contract.process(encryptedValue, encryptedBalance);

// Decrypt results
const result = privateKey.decrypt(encryptedResult);
```

### Contract-Side
```solidity
// Smart contract never sees plaintext
function process(bytes memory encryptedInput) public {
    auint32 decrypted = TFHE.asEuint32(encryptedInput);
    auint32 result = TFHE.add(decrypted, TFHE.asEuint32(10));
    // result is still encrypted
}
```

## Noise and Bootstrapping

### The Noise Problem
- Each operation adds "noise" to the ciphertext
- Too much noise makes decryption impossible
- Old FHE schemes required "fresh" ciphertexts

### Bootstrapping Solution
- TFHE bootstrapping resets noise in ~10ms
- Allows unlimited operations
- Transparent to application code

## Computational Complexity

### Operation Costs (Approximate)

| Operation | Cost (ms) | Gas (est.) |
|-----------|-----------|------------|
| add       | 1-5       | 5,000-10k  |
| mul       | 10-20     | 20k-50k    |
| eq/lt/gt  | 20-50     | 50k-100k   |
| div       | 50-100    | 100k-200k  |
| bootstrap | 10        | 20k-50k    |

## Security Considerations

### What's Secure
- **Value privacy**: Ciphertext reveals nothing about plaintext
- **Computation privacy**: Operations don't leak information
- **Result privacy**: Only owner can decrypt

### What's NOT Secure
- **Access patterns**: Who sends what transactions
- **Contract logic**: The code is public
- **Timing**: Operation duration may leak information

## Next Steps

- [Architecture](architecture.md) — System design and implementation
- [Core Concepts](core-concepts.md) — Application-level understanding
- [Building Your First Contract](building-first-contract.md) — Hands-on coding
