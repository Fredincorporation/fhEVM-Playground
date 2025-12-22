import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../../../../scripts/test-helpers";

describe("SwapsPremium", function () {
  let swaps: any;

  beforeEach(async () => {
    await initGateway();
    const Factory = await ethers.getContractFactory("SwapsPremium");
    swaps = await Factory.deploy();
  });

  it.skip("adds liquidity and updates encrypted reserves", async () => {
    const { ciphertext: a } = await getSignatureAndEncryption(100);
    const { ciphertext: b } = await getSignatureAndEncryption(200);
    await expect(swaps.addLiquidity(a, b)).to.emit(swaps, "LiquidityAdded");
    const [ra, rb] = await swaps.getReserves();
    expect(ra).to.exist;
    expect(rb).to.exist;
  });

  it.skip("swapAToB emits Swap and adjusts reserves (encrypted)", async () => {
    const { ciphertext: a } = await getSignatureAndEncryption(1000);
    const { ciphertext: b } = await getSignatureAndEncryption(1000);
    await swaps.addLiquidity(a, b);

    const { ciphertext: inAmount } = await getSignatureAndEncryption(10);
    await expect(swaps.swapAToB(inAmount)).to.emit(swaps, "Swap");
    const [ra, rb] = await swaps.getReserves();
    expect(ra).to.exist;
    expect(rb).to.exist;
  });
});
