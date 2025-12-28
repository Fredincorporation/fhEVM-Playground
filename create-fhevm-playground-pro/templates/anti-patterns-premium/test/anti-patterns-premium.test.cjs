const { ethers } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");

// Ensure ethers utilities are available (fallback to standalone ethers if needed)
if (!ethers.utils) {
  const _ethers = require("ethers");
  ethers.utils = _ethers.utils;
  ethers.BigNumber = _ethers.BigNumber;
}
const { utils, BigNumber } = require("ethers");

// Helpers used across examples for gateway setup and encryption stubs.
// The exact path may vary depending on workspace layout; adjust if needed.
const { initGateway, getSignatureAndEncryption, isMockedMode } = require("../scripts/test-helpers.cjs");

describe("AntiPatternsPremium", function () {
  let anti;

  beforeEach(async () => {
    await initGateway();
    const Factory = await ethers.getContractFactory("AntiPatternsPremium");
    anti = await Factory.deploy();
  });

  it("insecureStore stores raw ciphertext and emits event", async () => {
    const { ciphertext } = await getSignatureAndEncryption(123);
    await expect(anti.insecureStore(ciphertext)).to.emit(anti, "InsecureStored");
    const stored = await anti.rawCiphertext();
    expect(stored).to.equal(ciphertext);
  });

  it("secureStoreEncrypted stores encrypted primitive and emits event", async () => {
    const { ciphertext } = await getSignatureAndEncryption(10);
    await expect(anti.secureStoreEncrypted(ciphertext)).to.emit(anti, "SecureStored");
  });

  it("decryptOnChain reverts to discourage pattern", async () => {
    const { ciphertext } = await getSignatureAndEncryption(1);
    await expect(anti.decryptOnChain(ciphertext)).to.be.revertedWith(
      "Do not decrypt on-chain; use an off-chain gateway"
    );
  });

  it("insecureLoop returns expected sum", async () => {
    const a = "0x" + Buffer.from("a").toString("hex");
    const bb = "0x" + Buffer.from("bb").toString("hex");
    const sum = await anti.insecureLoop([a, bb]);
    // returned as numeric-like value — compare string form
    expect(sum.toString()).to.equal("3");
  });

  it("safeAggregate accepts encrypted inputs and returns an encrypted value", async () => {
    const sig1 = await getSignatureAndEncryption(5);
    const sig2 = await getSignatureAndEncryption(7);
    // call should not revert; returned value is an encrypted primitive
    const out = await anti.safeAggregate([sig1.ciphertext, sig2.ciphertext]);
    expect(out).to.exist;
  });
});
