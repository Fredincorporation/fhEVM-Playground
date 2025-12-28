const { ethers } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");

const { initGateway, getSignatureAndEncryption, isMockedMode } = require("../scripts/test-helpers.cjs");

describe("VestingPremium", function () {
  let vesting;
  let creator;
  let beneficiary;

  beforeEach(async () => {
    await initGateway();
    [creator, beneficiary] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VestingPremium");
    vesting = await Factory.deploy();
    await vesting.waitForDeployment();
  });

  it("creates a vest and beneficiary can claim after release", async () => {
    const latest = await ethers.provider.getBlock('latest');
    const future = latest.timestamp + 1000; // safely in the future
    const { ciphertext } = await getSignatureAndEncryption(123);
    const v = await ethers.deployContract("VestingPremium");
    await v.waitForDeployment();
    // compute id from current vestCount, then create
    const id = Number(await v.vestCount());
    const tx = await v.createVest(beneficiary.address, ciphertext, future);
    await tx.wait();

    // advance time beyond release
    await ethers.provider.send("evm_increaseTime", [1001]);
    await ethers.provider.send("evm_mine", []);

    await expect(v.connect(beneficiary).claimVest(id)).to.emit(v, "VestClaimed");
  });

  it("reverts if non-beneficiary tries to claim", async () => {
    const latest = await ethers.provider.getBlock('latest');
    const future = latest.timestamp + 1000;
    const { ciphertext } = await getSignatureAndEncryption(50);
    const v = await ethers.deployContract("VestingPremium");
    await v.waitForDeployment();
    const id = Number(await v.vestCount());
    await v.createVest(beneficiary.address, ciphertext, future);

    // advance time beyond release
    await ethers.provider.send("evm_increaseTime", [1001]);
    await ethers.provider.send("evm_mine", []);

    const [, , other] = await ethers.getSigners();
    await expect(v.connect(other).claimVest(id)).to.be.revertedWith("not-beneficiary");
  });
});
