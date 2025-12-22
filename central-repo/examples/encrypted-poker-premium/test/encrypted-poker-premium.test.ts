import { expect } from "chai";
import { ethers } from "hardhat";
import { initGateway, getSignatureAndEncryption, isMockedMode } from "../../../../scripts/test-helpers";

describe("EncryptedPokerPremium", function () {
  let poker: any;
  let owner: any;
  let alice: any;
  let bob: any;

  beforeEach(async () => {
    await initGateway();
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("EncryptedPokerPremium");
    poker = await Factory.deploy();
  });

  it("creates a game and players submit encrypted hands", async () => {
    const players = [alice.address, bob.address];
    const tx = await poker.createGame(players);
    await tx.wait();
    const { ciphertext: handA } = await getSignatureAndEncryption(0xdead);
    const { ciphertext: handB } = await getSignatureAndEncryption(0xbeef);
    await expect(poker.connect(alice).submitHand(0, handA)).to.emit(poker, "HandSubmitted");
    await expect(poker.connect(bob).submitHand(0, handB)).to.emit(poker, "HandSubmitted");
  });

  it.skip("owner can start and finalize the game with gateway-provided winner and encrypted pot", async () => {
    const players = [alice.address, bob.address];
    await poker.createGame(players);
    const { ciphertext: handA } = await getSignatureAndEncryption(1);
    const { ciphertext: handB } = await getSignatureAndEncryption(2);
    await poker.connect(alice).submitHand(0, handA);
    await poker.connect(bob).submitHand(0, handB);

    const { ciphertext: initPot } = await getSignatureAndEncryption(100);
    await expect(poker.connect(owner).startGame(0, initPot)).to.emit(poker, "GameStarted");

    const { ciphertext: winningHand } = await getSignatureAndEncryption(2);
    const { ciphertext: finalPot } = await getSignatureAndEncryption(150);
    await expect(poker.connect(owner).finalizeGame(0, bob.address, winningHand, finalPot)).to.emit(poker, "GameFinalized");
    const info = await poker.gameInfo(0);
    expect(info[3]).to.equal(bob.address); // winner
  });
});
