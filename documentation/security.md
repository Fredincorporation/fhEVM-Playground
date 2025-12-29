# Security & Best Practices

## Security Overview

Building secure FHE contracts requires understanding both cryptographic guarantees and smart contract vulnerabilities.

### What FHE Guarantees
- **Data privacy**: Encrypted values are cryptographically hidden
- **Computation privacy**: Operations don't leak intermediate values
- **Decryption security**: Only the private key holder can decrypt

### What FHE Does NOT Guarantee
- **Access control**: Who can call functions (your responsibility)
- **Timing attacks**: Operation duration may leak information
- **Side channels**: Blockchain state/metadata is still visible

## Common Vulnerabilities

### 1. Plaintext Leakage
**Problem**: Accidentally converting encrypted data to plaintext

```solidity
// ❌ BAD: Leaks the value!
bool isGreater = TFHE.decrypt(TFHE.gt(a, b));

// ✅ GOOD: Keep encrypted
result = TFHE.select(TFHE.gt(a, b), value1, value2);
```

### 2. Access Control Failures
**Problem**: Missing permission checks on encrypted operations

```solidity
// ❌ BAD: Anyone can modify balance
function deposit(bytes calldata encryptedAmount) public {
    balance = TFHE.add(balance, TFHE.asEuint32(encryptedAmount));
}

// ✅ GOOD: Proper authorization
function deposit(bytes calldata encryptedAmount) public onlyUser {
    userBalance[msg.sender] = TFHE.add(
        userBalance[msg.sender], 
        TFHE.asEuint32(encryptedAmount)
    );
}
```

## Best Practices

### 1. Principle of Least Privilege
```solidity
contract SecureVault {
    euint32 private balance; // Only owner sees
}
```

### 2. Defense in Depth
```solidity
function withdraw(bytes calldata encryptedAmount) public {
    require(msg.sender == owner, "Not authorized");
    require(encryptedAmount.length == 32, "Invalid input");
}
```

### 3. Secure Key Management
- Never store private keys on-chain
- Use threshold cryptography for decryption
- Implement key rotation policies

### 4. Testing & Verification
```bash
npm test
npm run deploy:testnet
```

## Security Audit Checklist

- [ ] Access control properly implemented
- [ ] No plaintext leakage
- [ ] Input validation complete
- [ ] State invariants documented and maintained
- [ ] Tests cover edge cases
- [ ] Private keys never on-chain
- [ ] Deployment scripts reviewed

## Resources

- [Zama Security](https://docs.zama.org/security)
- [OWASP Smart Contracts](https://owasp.org/www-community/smart_contracts)
- [Solidity Docs](https://docs.soliditylang.org/)

## Next Steps

- [Walkthroughs](walkthroughs.md) — Testing and deployment guides
- [Troubleshooting](troubleshooting.md) — Common issues and fixes
- [Documentation Home](README.md) — Full reference
