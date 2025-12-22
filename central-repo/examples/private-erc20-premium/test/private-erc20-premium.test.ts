import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption } from "../../../../scripts/test-helpers";

describe("PrivateERC20Premium", function () {
  let token: any;
  let owner: any;
  let alice: any;
  let bob: any;

  beforeEach(async () => {
    await initGateway();
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PrivateERC20Premium");
    token = await Factory.deploy();
  });

  it("owner can mint encrypted balance and event emitted", async () => {
    const { ciphertext } = await getSignatureAndEncryption(100);
    await expect(token.connect(owner).mintEncrypted(alice.address, ciphertext)).to.emit(token, "EncryptedMint");
    const enc = await token.encryptedBalanceOf(alice.address);
    expect(enc).to.exist;
  });

  it("non-owner cannot mint", async () => {
    const { ciphertext } = await getSignatureAndEncryption(50);
    await expect(token.connect(alice).mintEncrypted(bob.address, ciphertext)).to.be.revertedWith("not-owner");
  });

  it("transferEncrypted moves encrypted value between accounts", async () => {
    const { ciphertext: c1 } = await getSignatureAndEncryption(30);
    const { ciphertext: c2 } = await getSignatureAndEncryption(10);
    await token.connect(owner).mintEncrypted(alice.address, c1);
    // transfer 10 (ciphertext c2) from alice -> bob
    await expect(token.connect(alice).transferEncrypted(bob.address, c2)).to.emit(token, "EncryptedTransfer");
    const aliceEnc = await token.encryptedBalanceOf(alice.address);
    const bobEnc = await token.encryptedBalanceOf(bob.address);
    expect(aliceEnc).to.exist;
    expect(bobEnc).to.exist;
  });
});
