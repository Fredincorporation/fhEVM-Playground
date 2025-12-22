import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../../../../scripts/test-helpers";

describe("ERC7984Premium", function () {
  let token: any;
  let owner: any;
  let module: any;
  let alice: any;
  let bob: any;

  beforeEach(async () => {
    await initGateway();
    [owner, module, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ERC7984Premium");
    token = await Factory.deploy();
  });

  it("owner registers a module and module can mint", async () => {
    await token.connect(owner).registerModule(module.address);
    const { ciphertext } = await getSignatureAndEncryption(500);
    await expect(token.connect(module).mintByModule(alice.address, ciphertext)).to.emit(token, "EncryptedMintByModule");
    const enc = await token.encryptedBalanceOf(alice.address);
    expect(enc).to.exist;
  });

  it("approveEncrypted and transferFromEncrypted flow", async () => {
    // register module and mint some balance to alice
    await token.connect(owner).registerModule(module.address);
    const { ciphertext: minted } = await getSignatureAndEncryption(1000);
    await token.connect(module).mintByModule(alice.address, minted);

    // alice approves bob (spender) an encrypted allowance
    const { ciphertext: allowance } = await getSignatureAndEncryption(200);
    await token.connect(alice).approveEncrypted(bob.address, allowance);

    // bob transfers from alice to module (as an example recipient)
    const { ciphertext: transferAmount } = await getSignatureAndEncryption(50);
    await expect(token.connect(bob).transferFromEncrypted(alice.address, module.address, transferAmount)).to.emit(token, "EncryptedTransferFrom");

    const aliceEnc = await token.encryptedBalanceOf(alice.address);
    const moduleEnc = await token.encryptedBalanceOf(module.address);
    expect(aliceEnc).to.exist;
    expect(moduleEnc).to.exist;
  });
});
