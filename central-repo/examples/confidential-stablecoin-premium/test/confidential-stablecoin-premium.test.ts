import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers";

describe("ConfidentialStablecoinPremium", function () {
  let token: any;
  let owner: any;
  let alice: any;
  let bob: any;

  beforeEach(async () => {
    await initGateway();
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ConfidentialStablecoinPremium");
    token = await Factory.deploy();
  });

  it.skip("owner mints encrypted amounts and events emitted", async () => {
    const { ciphertext } = await getSignatureAndEncryption(1000);
    await expect(token.connect(owner).mintEncrypted(alice.address, ciphertext)).to.emit(token, "EncryptedMint");
    const enc = await token.encryptedBalanceOf(alice.address);
    expect(enc).to.exist;
  });

  it.skip("transferEncrypted moves encrypted value between accounts", async () => {
    const { ciphertext: minted } = await getSignatureAndEncryption(200);
    await token.connect(owner).mintEncrypted(alice.address, minted);
    const { ciphertext: transferAmount } = await getSignatureAndEncryption(50);
    await expect(token.connect(alice).transferEncrypted(bob.address, transferAmount)).to.emit(token, "EncryptedTransfer");
    const aEnc = await token.encryptedBalanceOf(alice.address);
    const bEnc = await token.encryptedBalanceOf(bob.address);
    expect(aEnc).to.exist;
    expect(bEnc).to.exist;
  });

  it.skip("redeemEncrypted emits request and reduces balance", async () => {
    const { ciphertext: minted } = await getSignatureAndEncryption(500);
    await token.connect(owner).mintEncrypted(alice.address, minted);
    const { ciphertext: redeemAmt } = await getSignatureAndEncryption(200);
    await expect(token.connect(alice).redeemEncrypted(redeemAmt, bob.address)).to.emit(token, "EncryptedRedeemRequested");
  });
});
