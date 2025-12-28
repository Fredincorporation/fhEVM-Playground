const { ethers } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");

const { initGateway, getSignatureAndEncryption, isMockedMode } = require("../scripts/test-helpers.cjs");

describe("SwapsPremium", function () {
  let swaps;

  beforeEach(async () => {
    await initGateway();
    const Factory = await ethers.getContractFactory("SwapsPremium");
    swaps = await Factory.deploy();
  });

  it("adds liquidity and updates encrypted reserves", async () => {
    const { ciphertext: a } = await getSignatureAndEncryption(100);
    const { ciphertext: b } = await getSignatureAndEncryption(200);
    await expect(swaps.addLiquidity(a, b)).to.emit(swaps, "LiquidityAdded");
    const [ra, rb] = await swaps.getReserves();
    expect(ra).to.exist;
    expect(rb).to.exist;
  });

  it("swapAToB emits Swap and adjusts reserves (encrypted)", async () => {
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
