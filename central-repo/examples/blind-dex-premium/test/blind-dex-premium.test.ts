import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../../../../scripts/test-helpers";

describe("BlindDEXPremium", function () {
  let dex: any;
  let owner: any;
  let makerA: any;
  let makerB: any;

  beforeEach(async () => {
    await initGateway();
    [owner, makerA, makerB] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("BlindDEXPremium");
    dex = await Factory.deploy();
  });

  it("places encrypted orders and reports order count", async () => {
    const { ciphertext: amountA } = await getSignatureAndEncryption(100);
    const { ciphertext: priceA } = await getSignatureAndEncryption(5);
    const tx = await dex.connect(makerA).placeOrder(amountA, priceA);
    await expect(tx).to.emit(dex, "OrderPlaced");

    const { ciphertext: amountB } = await getSignatureAndEncryption(200);
    const { ciphertext: priceB } = await getSignatureAndEncryption(4);
    await expect(dex.connect(makerB).placeOrder(amountB, priceB)).to.emit(dex, "OrderPlaced");

    const count = await dex.orderCount();
    expect(count).to.equal(2);
  });

  it("owner can finalize trade and emits TradeFinalized", async () => {
    const { ciphertext: amountA } = await getSignatureAndEncryption(50);
    const { ciphertext: priceA } = await getSignatureAndEncryption(5);
    await dex.connect(makerA).placeOrder(amountA, priceA);
    const { ciphertext: amountB } = await getSignatureAndEncryption(50);
    const { ciphertext: priceB } = await getSignatureAndEncryption(5);
    await dex.connect(makerB).placeOrder(amountB, priceB);

    // owner finalizes matching orders (0 and 1)
    const { ciphertext: settledAmount } = await getSignatureAndEncryption(50);
    const { ciphertext: settledPrice } = await getSignatureAndEncryption(5);
    await expect(dex.connect(owner).finalizeTrade(0, 1, settledAmount, settledPrice)).to.emit(dex, "TradeFinalized");
  });
});
