import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers";

describe("BlindAuctionPremium", function () {
  let auction: any;
  let owner: any;
  let alice: any;
  let bob: any;

  beforeEach(async () => {
    await initGateway();
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("BlindAuctionPremium");
    auction = await Factory.deploy();
  });

  it.skip("accepts encrypted bids and records bidders", async () => {
    const { ciphertext: a } = await getSignatureAndEncryption(100);
    const { ciphertext: b } = await getSignatureAndEncryption(150);
    await expect(auction.connect(alice).submitBid(a)).to.emit(auction, "BidSubmitted");
    await expect(auction.connect(bob).submitBid(b)).to.emit(auction, "BidSubmitted");
    const count = await auction.bidderCount();
    expect(count).to.equal(2);
  });

  it.skip("owner can close bidding and finalize with a provided winner", async () => {
    const { ciphertext: a } = await getSignatureAndEncryption(100);
    const { ciphertext: b } = await getSignatureAndEncryption(150);
    await auction.connect(alice).submitBid(a);
    await auction.connect(bob).submitBid(b);

    await expect(auction.connect(owner).closeBidding()).to.emit(auction, "AuctionClosed");

    // off-chain gateway decides bob wins; owner finalizes with encrypted winning bid
    await expect(auction.connect(owner).finalizeAuction(bob.address, b)).to.emit(auction, "AuctionFinalized");
    const win = await auction.winner();
    expect(win).to.equal(bob.address);
  });
});
