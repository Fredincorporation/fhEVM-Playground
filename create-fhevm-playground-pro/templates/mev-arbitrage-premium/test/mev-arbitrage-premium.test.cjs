const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

const { initGateway, getSignatureAndEncryption } = require("../scripts/test-helpers.cjs");

describe("MEVArbitragePremium", function () {
  let mev;
  let owner;
  let proposer;

  beforeEach(async () => {
    await initGateway();
    [owner, proposer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MEVArbitragePremium");
    mev = await Factory.deploy();
  });

  it("submits encrypted prices and records them", async () => {
  // mev-arbitrage test (CJS) removed from template to avoid cross-test leakage.
  // Please add focused example tests in the generated project's `test/` folder.
    const { ciphertext: price } = await getSignatureAndEncryption(2000);
    await expect(mev.submitEncryptedPrice(sym, price)).to.emit(mev, "PriceSubmitted");
    const stored = await mev.priceOf(sym);
    expect(stored).to.exist;
  });

  it("proposes arbitrage and owner finalizes it", async () => {
    const buy = ethers.id("PAIRA").slice(0, 66);
    const sell = ethers.id("PAIRB").slice(0, 66);
    const { ciphertext: profit } = await getSignatureAndEncryption(42);
    const tx = await mev.connect(proposer).proposeArbitrage(buy, sell, profit);
    await expect(tx).to.emit(mev, "ArbitrageProposed");
    // owner finalizes and records encrypted profit
    await expect(mev.connect(owner).finalizeArbitrage(0, proposer.address, profit)).to.emit(mev, "ArbitrageFinalized");
  });
});
