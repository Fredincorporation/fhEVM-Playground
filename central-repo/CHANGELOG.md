# Changelog

## [1.0.50] - 2025-12-28

- fix: ensure generated projects include mocked gateway init line (`✅ Gateway initialized (MOCK MODE)`) by writing `test/test-helpers.ts` and prepending `initGateway()` to tests when missing
- feat: add `scripts/fix-generated-project.cjs` helper to patch generated projects when using published CLI

*Note: This release prepares a short-term workaround (the fixer script) for published CLI users while the full scaffolder updates are published.*

## [1.0.51] - 2025-12-28

- feat: auto-update CLI — when a newer version is published, the local CLI will re-run using the latest package so users can run `npx create-fhevm-playground-pro guided` without remembering versions

