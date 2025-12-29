// Ensure hardhat context is available globally
let hre: any;

try {
  hre = require('hardhat');
} catch (e) {
  // Hardhat will be available during test execution via mocha registration
}

export { hre };
