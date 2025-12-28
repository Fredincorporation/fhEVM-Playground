/**
 * Mock ethers environment for testing without full Hardhat setup
 */

export const ethers = {
  getSigners: async () => {
    // Return mock accounts
    return [
      { address: '0x1111111111111111111111111111111111111111' },
      { address: '0x2222222222222222222222222222222222222222' },
      { address: '0x3333333333333333333333333333333333333333' },
    ];
  },
};

export const typeChainTypes = {};
