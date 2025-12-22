require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.24',
  paths: {
    // We'll override sources per-run by creating multiple partial configs if needed
    sources: 'examples/basic-counter-premium/contracts'
  },
  mocha: {
    timeout: 200000
  }
};
