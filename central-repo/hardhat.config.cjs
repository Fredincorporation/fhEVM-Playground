// Load plugins
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-ethers");

const MNEMONIC = process.env.MNEMONIC || 'test test test test test test test test test test test junk';
const INFURA_API_KEY = process.env.INFURA_API_KEY || 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  namedAccounts: { deployer: 0 },
  etherscan: { apiKey: { sepolia: process.env.ETHERSCAN_API_KEY || '' } },
  gasReporter: { currency: 'USD', enabled: process.env.REPORT_GAS ? true : false, excludeContracts: [] },
  networks: {
    hardhat: { accounts: { mnemonic: MNEMONIC }, chainId: 31337 },
    anvil: { accounts: { mnemonic: MNEMONIC, path: "m/44'/60'/0'/0/", count: 10 }, chainId: 31337, url: 'http://localhost:8545' },
    sepolia: { accounts: { mnemonic: MNEMONIC, path: "m/44'/60'/0'/0/", count: 10 }, chainId: 11155111, url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}` },
  },
  paths: { artifacts: './artifacts', cache: './cache', sources: './contracts', tests: './test' },
  solidity: { version: '0.8.27', settings: { metadata: { bytecodeHash: 'none' }, optimizer: { enabled: true, runs: 800 }, evmVersion: 'cancun' } },
  typechain: { outDir: 'types', target: 'ethers-v6' },
  mocha: { timeout: 200000 },
};
