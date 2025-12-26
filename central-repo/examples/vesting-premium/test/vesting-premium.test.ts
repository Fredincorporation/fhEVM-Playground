import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers";

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

  it.skip("creates a vest and beneficiary can claim after release", async () => {
    const future = Math.floor(Date.now() / 1000) + 2; // 2 seconds in future
    const { ciphertext } = await getSignatureAndEncryption(123);
    const tx = await vesting.createVest(beneficiary.address, ciphertext, future);
    const rc = await tx.wait();
    const evt = rc.events?.find((e: any) => e.event === "VestCreated");
    expect(evt).to.exist;
    const id = evt.args[0].toNumber ? evt.args[0].toNumber() : Number(evt.args[0]);

    // advance time
    await ethers.provider.send("evm_increaseTime", [3]);
    await ethers.provider.send("evm_mine", []);

    await expect(vesting.connect(beneficiary).claimVest(id)).to.emit(vesting, "VestClaimed");
  });

  it.skip("reverts if non-beneficiary tries to claim", async () => {
    const future = Math.floor(Date.now() / 1000) + 1;
    const { ciphertext } = await getSignatureAndEncryption(50);
    const tx = await vesting.createVest(beneficiary.address, ciphertext, future);
    const rc = await tx.wait();
    const id = rc.events?.find((e: any) => e.event === "VestCreated").args[0];

    // advance time
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    const [_, other] = await ethers.getSigners();
    await expect(vesting.connect(other).claimVest(id)).to.be.revertedWith("not-beneficiary");
  });
});
