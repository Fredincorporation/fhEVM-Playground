require('@nomicfoundation/hardhat-toolbox');
require('ts-node/register');

const config = {
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './artifacts'
  },
  mocha: {
    extensions: ['ts', 'js'],
    spec: 'test/**/*.test.{ts,js}',
    require: ['ts-node/register'],
    timeout: 200000,
    reporter: 'spec'
  }
};

module.exports = config;
