# fhEVM Architecture

Understand how fhEVM integrates FHE into the Ethereum Virtual Machine.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                  User's Device                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Private Key  │  Generate Input  │  Decrypt Output            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────┬──────────────────────┘
                         │
                    Encrypted Data
                    (Public Key)
                         │
┌─────────────────────────────────────────────┬──────────────────────┐
│                  Blockchain                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Smart Contract (Solidity + TFHE.sol)                        │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │ TFHE Operations                                         │  │  │
│  │  │ • add, mul, div                                         │  │  │
│  │  │ • eq, lt, gt, le, ge                                    │  │  │
│  │  │ • and, or, xor, not                                     │  │  │
│  │  │ • select (if-then-else)                                 │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  Encrypted State Variables (euint32, etc.)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                         │
              Encrypted Results
                         │
┌─────────────────────────────────────────────────────────────────────┐
│                User's Device                                        │
│         Decrypt with Private Key                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. User-Side Library
Typically uses **fhevm-js** or **fhevm-go**:
- Generate public/private key pairs
- Encrypt user inputs
- Decrypt contract outputs
- Manage key storage and recovery

### 2. TFHE.sol Library
Pre-compiled Solidity library included in scaffolded projects:
```solidity
import "./fhevm/lib/TFHE.sol";

auint32 a = TFHE.asEuint32(encryptedInput);
auint32 result = TFHE.add(a, TFHE.asEuint32(10));
```

### 3. Smart Contract (Your Code)
Your custom logic using TFHE operations:
```solidity
contract MyApp {
    euint32 private secretBalance;
    
    function deposit(bytes calldata encryptedAmount) public {
        auint32 amount = TFHE.asEuint32(encryptedAmount);
        secretBalance = TFHE.add(secretBalance, amount);
    }
}
```

### 4. FHE Executor
On testnet/mainnet, a background process:
- Monitors for new encrypted transactions
- Executes TFHE operations
- Produces encrypted results
- Updates blockchain state

## Data Flow

### Step 1: User Encryption
```
User enters: "send 100 tokens"
      ↓
Public Key: 0xabc123...
      ↓
Encrypted: 0x2f9e14...
```

### Step 2: Transaction Submission
```
Transaction {
  to: MyContract,
  function: deposit,
  args: [0x2f9e14...],  // encrypted amount
}
```

### Step 3: Contract Execution
```solidity
auint32 amount = TFHE.asEuint32(0x2f9e14...);
secretBalance = TFHE.add(secretBalance, amount);
// secretBalance is now: (old_balance + 100) encrypted
```

### Step 4: State Update
```
Blockchain State:
  secretBalance = 0x5a3f... (encrypted value of new balance)
```

### Step 5: User Decryption
```
Private Key: 0xdef456...
Encrypted Result: 0x5a3f...
      ↓
Decrypted: 1500 (new balance)
```

## Mocked Mode vs Live Mode

### Mocked Mode (Development)
- Operations are instant
- Uses plaintext under the hood
- Perfect for testing logic
- Used in `npm test`

**Use cases**:
- Rapid prototyping
- Unit tests
- CI/CD pipelines

### Live Mode (Testnet/Mainnet)
- Real FHE computations
- Slow but cryptographically proven
- Complete privacy guarantees
- Used in `npm run deploy:testnet`

**Use cases**:
- Staging environments
- Security audits
- Production deployments

## State Management

### Encrypted State Variables
```solidity
euint32 private balance;       // Encrypted at rest
euint64 private timestamp;      // Encrypted at rest
bool public revealed;           // Plaintext (everyone sees)
```

### Why Mix Encrypted and Plaintext?
- Some data is inherently public (metadata, timestamps for UX)
- Some data needs privacy (balances, identities)
- Smart contract design balances both concerns

## Gas and Performance

### Mocked Mode
- Instant operations
- Low gas costs (testing)
- No real FHE computation

### Live Mode Estimates

| Operation | Time | Gas |
|-----------|------|-----|
| add       | 5ms  | 10k |
| mul       | 15ms | 50k |
| eq/lt/gt  | 30ms | 80k |

**Full transaction** (with FHE overhead): 100ms - 1sec

## Security Architecture

### Threshold Scheme
- Private key never on-chain
- Encryption uses threshold cryptography
- Multiple parties hold key shares
- Decryption requires sufficient threshold

### Separation of Concerns
- **User**: Holds private key, encrypts/decrypts
- **Contract**: Processes encrypted data only
- **Blockchain**: Records encrypted state

## Integration Points

### With Existing DApps
1. Add TFHE library to contract
2. Convert sensitive state to encrypted types
3. Update logic to use TFHE operations
4. Encrypt user inputs client-side

### With Hardhat
- Built-in support via devnet
- Mocked execution for tests
- Deploy to testnet for real FHE

## Next Steps

- [Core Concepts](core-concepts.md) — Application-level overview
- [FHE Fundamentals](fhe-fundamentals.md) — Cryptographic details
- [Building Your First Contract](building-first-contract.md) — Hands-on coding
