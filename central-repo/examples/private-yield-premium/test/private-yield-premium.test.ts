import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers";

describe("PrivateYieldPremium", function () {
  let yieldContract: any;
  let owner: any;
  let staker: any;

  beforeEach(async () => {
    await initGateway();
    [owner, staker] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PrivateYieldPremium");
    yieldContract = await Factory.deploy();
  });

  it.skip("staker can stake encrypted amount and owner can accrue reward", async () => {
    const { ciphertext: stake } = await getSignatureAndEncryption(500);
    await expect(yieldContract.connect(staker).stakeEncrypted(stake)).to.emit(yieldContract, "Staked");

    const { ciphertext: reward } = await getSignatureAndEncryption(50);
    await expect(yieldContract.connect(owner).accrueReward(staker.address, reward)).to.emit(yieldContract, "RewardAccrued");

    const encReward = await yieldContract.encryptedRewardsOf(staker.address);
    expect(encReward).to.exist;
  });

  it.skip("staker can claim encrypted rewards and event is emitted", async () => {
    const { ciphertext: stake } = await getSignatureAndEncryption(200);
    await yieldContract.connect(staker).stakeEncrypted(stake);
    const { ciphertext: reward } = await getSignatureAndEncryption(20);
    await yieldContract.connect(owner).accrueReward(staker.address, reward);

    await expect(yieldContract.connect(staker).claimRewards()).to.emit(yieldContract, "RewardClaimed");
    const post = await yieldContract.encryptedRewardsOf(staker.address);
    // reward cleared to zero
    expect(post).to.equal(ethers.constants.HashZero || 0);
  });
});
