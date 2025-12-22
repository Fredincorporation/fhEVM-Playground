require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.24',
  paths: {
    sources: 'examples/vesting-premium/contracts'
  },
  mocha: {
    timeout: 200000
  }
};
