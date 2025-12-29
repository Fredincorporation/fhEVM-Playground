import { expect } from "chai";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers.ts";

describe("VestingPremium", function () {
  let vesting: any;
  let creator: any;
  let beneficiary: any;

  beforeEach(async () => {
    await initGateway();
    [creator, beneficiary] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VestingPremium");
    vesting = await Factory.deploy();
  });

  it("creates a vest and beneficiary can claim after release", async () => {
    // use chain time to compute a safe future timestamp (avoid host vs chain clock drift)
    const block = await ethers.provider.getBlock("latest");
    const future = Number(block.timestamp) + 2; // 2 seconds in future
    const { ciphertext } = await getSignatureAndEncryption(123);
    const tx = await vesting.createVest(beneficiary.address, ciphertext, future);
    await tx.wait();
    // determine id from vestCount (createVest uses `id = vestCount++`)
    const count = await vesting.vestCount();
    const id = Number(count) - 1;

    // advance time
    await ethers.provider.send("evm_increaseTime", [3]);
    await ethers.provider.send("evm_mine", []);

    await expect(vesting.connect(beneficiary).claimVest(id)).to.emit(vesting, "VestClaimed");
  });

  it("reverts if non-beneficiary tries to claim", async () => {
    const block2 = await ethers.provider.getBlock("latest");
    const future = Number(block2.timestamp) + 1;
    const { ciphertext } = await getSignatureAndEncryption(50);
    const tx = await vesting.createVest(beneficiary.address, ciphertext, future);
    await tx.wait();
    const count2 = await vesting.vestCount();
    const id = Number(count2) - 1;

    // advance time
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    const signers = await ethers.getSigners();
    const other = signers[2];
    await expect(vesting.connect(other).claimVest(id)).to.be.revertedWith("not-beneficiary");
  });
});
