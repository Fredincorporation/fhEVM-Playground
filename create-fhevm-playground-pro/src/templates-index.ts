/**
 * Minimal templates index used by the CLI to display available categories.
 * Includes full official names and convenient aliases for better UX.
 */
export const CATEGORIES = [
  // Core (non-pro) categories - full names
  { id: 'basic-counter', name: 'Basic Counter', isPro: false },
  { id: 'arithmetic', name: 'Arithmetic Operations', isPro: false },
  { id: 'comparisons', name: 'Comparisons', isPro: false },
  { id: 'single-encryption', name: 'Single Encryption', isPro: false },
  { id: 'access-control', name: 'Access Control', isPro: false },
  { id: 'input-verification-proofs', name: 'Input Proofs', isPro: false },
  { id: 'anti-patterns-guide', name: 'Anti-Patterns Guide', isPro: false },
  { id: 'handles-lifecycle', name: 'Handles Lifecycle', isPro: false },
  { id: 'oz-erc7984-basic', name: 'OpenZeppelin ERC7984 Basic', isPro: false },
  { id: 'oz-erc20-wrapper', name: 'OZ ERC20 Wrapper', isPro: false },
  { id: 'vesting', name: 'Vesting', isPro: false },
  { id: 'blind-auction', name: 'Blind Auction', isPro: false },
  // Pro categories - full names
  { id: 'dao-voting-pro', name: 'DAO Voting Pro', isPro: true },
  { id: 'private-lending-pro', name: 'Private Lending Pro', isPro: true },
  { id: 'blind-dex-pro', name: 'Blind DEX Pro', isPro: true },
  { id: 'poker-game-pro', name: 'Poker Game Pro', isPro: true },
  { id: 'yield-farming-pro', name: 'Yield Farming Pro', isPro: true },
  { id: 'mev-arbitrage-pro', name: 'MEV Arbitrage Pro', isPro: true },
  { id: 'confidential-stablecoin-pro', name: 'Confidential Stablecoin Pro', isPro: true },
  // Aliases: short names for convenience (also pro since they map to pro categories)
  { id: 'anti-patterns', name: 'Anti-Patterns Guide', isPro: false },
  { id: 'blind-dex', name: 'Blind DEX Pro', isPro: true },
  { id: 'confidential-stablecoin', name: 'Confidential Stablecoin Pro', isPro: true },
  { id: 'dao-voting', name: 'DAO Voting Pro', isPro: true },
  { id: 'encrypted-poker', name: 'Encrypted Poker Game Pro', isPro: true },
  { id: 'erc7984', name: 'OpenZeppelin ERC7984 Basic', isPro: false },
  { id: 'input-proofs', name: 'Input Proofs', isPro: false },
  { id: 'mev-arbitrage', name: 'MEV Arbitrage Pro', isPro: true },
  { id: 'private-erc20', name: 'OZ ERC20 Wrapper', isPro: false },
  { id: 'private-lending', name: 'Private Lending Pro', isPro: true },
  { id: 'private-yield', name: 'Private Yield Farming Pro', isPro: true },
  { id: 'yield-farming', name: 'Private Yield Farming Pro', isPro: true },
];
