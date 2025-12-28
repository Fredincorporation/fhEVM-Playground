import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-ethers';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: false,
          },
        },
      },
    ],
  },
  paths: {
    sources: 'examples',
    tests: 'examples',
  },
  networks: {
    hardhat: {
      // Local network configuration
    },
  },
  mocha: {
    timeout: 200000,
    require: ['ts-node/register'],
    extension: ['ts', 'js'],
  },
};
