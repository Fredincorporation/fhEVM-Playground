/**
 * Test utilities for accessing Hardhat providers
 * Provides contract factories and signers via hardhat runtime
 */

export async function getContractFactory(contractName: string) {
  const artifacts = require("hardhat").artifacts;
  return artifacts.getContractFactory(contractName);
}

export async function getSigners() {
  const ethers = require("hardhat").ethers;
  return ethers.getSigners();
}
