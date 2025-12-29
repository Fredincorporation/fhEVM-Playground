# FAQ

Frequently asked questions about fhEVM and Playground Pro.

## General Questions

### What is fhEVM?
fhEVM is a framework that brings Fully Homomorphic Encryption (FHE) to Ethereum-compatible blockchains. It allows smart contracts to perform computations on encrypted data.

### What is FHE (Fully Homomorphic Encryption)?
FHE is a form of encryption that allows computation on ciphertexts, producing encrypted results without ever decrypting the data.

### Who should use fhEVM?
- DeFi protocols needing privacy
- DAO voting systems
- Gaming platforms
- Any app with sensitive data

## Getting Started

### Do I need to install anything locally?
No! Use GitHub Codespaces for zero-install development. Or install Node.js locally.

### Which operating system do I need?
fhEVM works on Windows, macOS, Linux, and GitHub Codespaces.

### How long does setup take?
Approximately 5 minutes total.

## Building Contracts

### What encrypted types are available?
- `euint8` (8-bit), `euint16` (16-bit), `euint32` (32-bit), `euint64` (64-bit)

### Can I mix encrypted and plaintext variables?
Yes! Some data (metadata) can be plaintext. Sensitive data should be encrypted.

### How do I prevent overflow?
Check bounds before arithmetic:
```solidity
require(TFHE.decrypt(TFHE.lt(TFHE.add(balance, amount), MAX_VALUE)), "Overflow");
```

## Testing

### Mocked vs Live Mode?
- **Mocked**: Instant, perfect for development
- **Live**: Real FHE, slower, cryptographically proven

### How do I test encrypted values?
Use `TFHE.decrypt()` in tests to compare values.

## Deployment

### Can I deploy to mainnet immediately?
Not recommended. Path: local dev -> testnet -> audit -> mainnet.

### Gas costs for FHE operations?
- Add: 5k-10k gas
- Multiply: 20k-50k gas
- Comparison: 50k-100k gas

### Which networks support fhEVM?
Testnet: Sepolia, Evmos testnet | Mainnet: Check Zama docs

## Security

### Is my data truly private?
Yes. FHE guarantees the blockchain can't see plaintext. But transaction metadata (who, when) is visible.

### What if I lose my private key?
You lose permanent access to encrypted data. Use secure key management and backups.

### Should I get a security audit?
Yes, for mainnet. Hire professionals and run thorough tests.

## More Help

- [Troubleshooting](troubleshooting.md) — Common issues and fixes
- [Documentation Home](README.md) — Full reference
- [Zama Discord](https://discord.gg/zama) — Community
- [GitHub Issues](https://github.com/Fredincorporation/fhEVM-Playground/issues) — Report bugs
