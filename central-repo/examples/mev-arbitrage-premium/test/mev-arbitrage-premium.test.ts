import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers";

describe("MEVArbitragePremium", function () {
  let mev: any;
  let owner: any;
  let proposer: any;

  beforeEach(async () => {
    await initGateway();
    [owner, proposer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MEVArbitragePremium");
    mev = await Factory.deploy();
  });

  it.skip("submits encrypted prices and records them", async () => {
    const sym = ethers.utils.formatBytes32String("ETH/USDC");
    const { ciphertext: price } = await getSignatureAndEncryption(2000);
    await expect(mev.submitEncryptedPrice(sym, price)).to.emit(mev, "PriceSubmitted");
    const stored = await mev.priceOf(sym);
    expect(stored).to.exist;
  });

  it.skip("proposes arbitrage and owner finalizes it", async () => {
    const buy = ethers.utils.formatBytes32String("PAIRA");
    const sell = ethers.utils.formatBytes32String("PAIRB");
    const { ciphertext: profit } = await getSignatureAndEncryption(42);
    const tx = await mev.connect(proposer).proposeArbitrage(buy, sell, profit);
    await expect(tx).to.emit(mev, "ArbitrageProposed");
    // owner finalizes and records encrypted profit
    await expect(mev.connect(owner).finalizeArbitrage(0, proposer.address, profit)).to.emit(mev, "ArbitrageFinalized");
  });
});
