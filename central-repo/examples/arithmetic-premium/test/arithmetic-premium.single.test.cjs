const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getSignatureAndEncryption, initGateway } = require("../scripts/test-helpers.cjs");

describe("ArithmeticPremium - Quick Single Test", function () {
  let contract;
  before(async () => {
    await initGateway();
  });
  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ArithmeticPremium");
    contract = await factory.deploy();
    await contract.waitForDeployment();
  });

  it("runs core ops", async () => {
    const { ciphertext: enc10 } = await getSignatureAndEncryption(10);
    const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
    await contract.setA(enc10);
    await contract.setB(enc5);
    await expect(contract.addAB()).to.emit(contract, "Added");
  });
});
