import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption } from "../../../../scripts/test-helpers";

describe("PrivateLendingPremium", function () {
  let lending: any;
  let lender: any;
  let borrower: any;

  beforeEach(async () => {
    await initGateway();
    [lender, borrower] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PrivateLendingPremium");
    lending = await Factory.deploy();
    await lending.deployed();
  });

  it("creates an offer and borrower accepts it", async () => {
    const { ciphertext: principal } = await getSignatureAndEncryption(1000);
    const { ciphertext: collateral } = await getSignatureAndEncryption(1500);
    const tx = await lending.connect(lender).createOffer(principal, collateral, 10);
    const rc = await tx.wait();
    // id 0
    await expect(lending.connect(borrower).acceptOffer(0)).to.emit(lending, "LoanAccepted");
  });

  it("borrower can repay and event emitted", async () => {
    const { ciphertext: principal } = await getSignatureAndEncryption(200);
    const { ciphertext: collateral } = await getSignatureAndEncryption(300);
    await lending.connect(lender).createOffer(principal, collateral, 1);
    await lending.connect(borrower).acceptOffer(0);
    const { ciphertext: repay } = await getSignatureAndEncryption(210);
    await expect(lending.connect(borrower).repayLoan(0, repay)).to.emit(lending, "LoanRepaid");
  });

  it("lender can liquidate after duration if not repaid", async () => {
    const { ciphertext: principal } = await getSignatureAndEncryption(500);
    const { ciphertext: collateral } = await getSignatureAndEncryption(700);
    await lending.connect(lender).createOffer(principal, collateral, 1);
    await lending.connect(borrower).acceptOffer(0);
    // advance time
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);
    await expect(lending.connect(lender).liquidate(0)).to.emit(lending, "LoanLiquidated");
  });

  it("cannot accept an already accepted offer", async () => {
    const { ciphertext: principal } = await getSignatureAndEncryption(100);
    const { ciphertext: collateral } = await getSignatureAndEncryption(120);
    await lending.connect(lender).createOffer(principal, collateral, 5);
    await lending.connect(borrower).acceptOffer(0);
    const other = (await ethers.getSigners())[2];
    await expect(lending.connect(other).acceptOffer(0)).to.be.revertedWith("already-accepted");
  });
});
