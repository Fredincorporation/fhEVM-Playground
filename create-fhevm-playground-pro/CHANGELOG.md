# Changelog

## 1.0.63 - 2025-12-29

- Rebuild and republish to ensure template fixes are available in npm package (numeric max + ethers v6 gasUsed).

## 1.0.62 - 2025-12-29

- Fix: Update arithmetic-premium template test to use numeric `max` and ethers v6-compatible gasUsed conversion (fixes scaffolded project test failures).

## 1.0.61 - 2025-12-28

- Fix: Ensure arithmetic example test uses numeric `max` and ethers v6-compatible `Number(receipt.gasUsed)` conversion in gas assertions.

## 1.0.60 - 2025-12-28

- Chore(templates): add BigNumberish normalization + `ethers` monkeypatch to template `scripts/test-helpers.ts` so scaffolded premium examples run their test suites out-of-the-box in mock mode.

## 1.0.53 - 2025-12-28

- Fix: Inject resilient `ethers` adapter into scaffolded `scripts/test-helpers.ts` to provide compatibility with tests expecting `ethers.utils` and `ethers.BigNumber` (supports CJS require, dynamic ESM import fallback, and prefers Hardhat's `hre.ethers`).
- Fix: Rewrite tests at scaffold time to handle `ethers.utils.hexlify`/`toUtf8Bytes` patterns and `ethers.BigNumber.from(...)` assertions so generated projects run their example tests without manual edits.
- Improvement: Ensure `templates/` examples are prioritized when scaffolding premium examples.

