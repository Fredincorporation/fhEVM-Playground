const { ethers } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");

const { initGateway, getSignatureAndEncryption, isMockedMode } = require("../scripts/test-helpers.cjs");

describe("DAOVotingPremium", function () {
  let dao;
  let owner;
  let alice;
  let bob;
  let charlie;

  beforeEach(async () => {
    await initGateway();
    [owner, alice, bob, charlie] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("DAOVotingPremium");
    dao = await Factory.deploy();
  });

  it("creates a proposal and accepts encrypted votes", async () => {
    const { ciphertext: meta } = await getSignatureAndEncryption(999);
    const rc = await (await dao.createProposal(meta)).wait();
    // proposal id is 0
    const id = 0;

    const { ciphertext: yes } = await getSignatureAndEncryption(1);
    const { ciphertext: no } = await getSignatureAndEncryption(0);

    await expect(dao.connect(alice).castVote(id, yes)).to.emit(dao, "VoteCast");
    await expect(dao.connect(bob).castVote(id, no)).to.emit(dao, "VoteCast");
    await expect(dao.connect(charlie).castVote(id, yes)).to.emit(dao, "VoteCast");

    // close and finalize with off-chain-provided encrypted tally (2 yes votes)
    await expect(dao.connect(owner).closeVoting(id)).to.emit(dao, "VotingClosed");
    const { ciphertext: tally } = await getSignatureAndEncryption(2);
    await expect(dao.connect(owner).finalizeVoting(id, alice.address, tally)).to.emit(dao, "VotingFinalized");

    const winner = await dao.proposals(id).then((p) => p.winner).catch(() => null);
    // `proposals` is a public mapping; direct access differs between ethers versions — check winner via contract accessor
    const storedWinner = await dao.proposals(0);
    expect(storedWinner.winner).to.equal(alice.address);
  });
});
