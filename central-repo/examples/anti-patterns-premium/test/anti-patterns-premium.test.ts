import { expect } from "chai";
import { ethers } from "hardhat";

// Helpers used across examples for gateway setup and encryption stubs.
// The exact path may vary depending on workspace layout; adjust if needed.
import { initGateway, getSignatureAndEncryption } from "../../../../scripts/test-helpers";

describe("AntiPatternsPremium", function () {
  let anti: any;

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
      "Do not decrypt on-chain"
    );
  });

  it("insecureLoop returns expected sum", async () => {
    const a = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("a"));
    const bb = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("bb"));
    const sum = await anti.insecureLoop([a, bb]);
    // returned as BigNumber
    expect(sum).to.equal(ethers.BigNumber.from(3));
  });

  it("safeAggregate accepts encrypted inputs and returns an encrypted value", async () => {
    const sig1 = await getSignatureAndEncryption(5);
    const sig2 = await getSignatureAndEncryption(7);
    // call should not revert; returned value is an encrypted primitive
    const out = await anti.safeAggregate([sig1.ciphertext, sig2.ciphertext]);
    expect(out).to.exist;
  });
});
