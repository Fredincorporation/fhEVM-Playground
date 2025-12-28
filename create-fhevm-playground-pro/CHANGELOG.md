# Changelog

## 1.0.60 - 2025-12-28

- Chore(templates): add BigNumberish normalization + `ethers` monkeypatch to template `scripts/test-helpers.ts` so scaffolded premium examples run their test suites out-of-the-box in mock mode.

## 1.0.53 - 2025-12-28

- Fix: Inject resilient `ethers` adapter into scaffolded `scripts/test-helpers.ts` to provide compatibility with tests expecting `ethers.utils` and `ethers.BigNumber` (supports CJS require, dynamic ESM import fallback, and prefers Hardhat's `hre.ethers`).
- Fix: Rewrite tests at scaffold time to handle `ethers.utils.hexlify`/`toUtf8Bytes` patterns and `ethers.BigNumber.from(...)` assertions so generated projects run their example tests without manual edits.
- Improvement: Ensure `templates/` examples are prioritized when scaffolding premium examples.

