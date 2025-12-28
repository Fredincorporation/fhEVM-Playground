// Cleaned test file — single-suite CommonJS tests
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getSignatureAndEncryption, initGateway } = require("../scripts/test-helpers.cjs");

describe("ArithmeticPremium - Clean Suite", () => {
  let contract;
  let owner;
  let addr1;
  let addr2;

  before(async () => {
    await initGateway();
  });

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ArithmeticPremium");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("deploys and has defaults", async () => {
    const addr = await contract.getAddress();
    expect(addr).to.be.properAddress;
    const a = await contract.getA();
    const b = await contract.getB();
    expect(a).to.not.be.undefined;
    expect(b).to.not.be.undefined;
  });

  it("setA and setB accept values and emit events", async () => {
    const { ciphertext: enc10 } = await getSignatureAndEncryption(10);
    const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
    await expect(contract.setA(enc10)).to.emit(contract, "ASet");
    await expect(contract.setB(enc5)).to.emit(contract, "BSet");
  });

  it("add/sub/mul emit expected events", async () => {
    const { ciphertext: enc7 } = await getSignatureAndEncryption(7);
    const { ciphertext: enc3 } = await getSignatureAndEncryption(3);
    await contract.setA(enc7);
    await contract.setB(enc3);
    await expect(contract.addAB()).to.emit(contract, "Added");
    await expect(contract.subAB()).to.emit(contract, "Subtracted");
    await expect(contract.mulAB()).to.emit(contract, "Multiplied");
  });

  it("mulAByConstant succeeds for small factors and reverts for large ones", async () => {
    const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
    await contract.setA(enc2);
    await expect(contract.mulAByConstant(5)).to.emit(contract, "Multiplied");
    const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
    await contract.setA(enc1);
    await expect(contract.mulAByConstant(1000)).to.be.revertedWith("factor-too-large");
  });

  it("anti-pattern demos callable (no revert)", async () => {
    await expect(contract.antiPattern_decryptThenCompute(10)).to.not.be.reverted;
    await expect(contract.antiPattern_heavyMultiply()).to.not.be.reverted;
  });

  it("handles large operands (wrap) without revert", async () => {
    const max = "1000";
    const { ciphertext: encMax } = await getSignatureAndEncryption(max);
    await contract.setA(encMax);
    await contract.setB(encMax);
    const tx = await contract.addAB();
    expect(tx).to.not.be.undefined;
  });

  it("owner helpers enforce only-owner", async () => {
    await expect(contract.setOwner(addr1.address)).to.not.be.reverted;
    await expect(contract.connect(addr2).setOwner(owner.address)).to.be.reverted;
  });

  it("gas usage for addAB is reasonable", async () => {
    const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
    const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
    await contract.setA(enc1);
    await contract.setB(enc2);
    const tx = await contract.addAB();
    const receipt = await tx.wait();
    expect(Number(receipt.gasUsed)).to.be.lessThan(200000);
  });
});
