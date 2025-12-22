import 'dotenv/config';

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: '0.8.24',
  paths: {
    sources: 'examples',
  },
  mocha: {
    timeout: 200000,
  },
};
