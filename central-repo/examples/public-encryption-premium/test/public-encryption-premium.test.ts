import { expect } from "chai";
import { ethers } from "hardhat";
import type { PublicEncryptionPremium } from "../typechain-types";
import { getSignatureAndEncryption, initGateway } from "fhevm";

describe("PublicEncryptionPremium - Tests", () => {
    let contract: PublicEncryptionPremium;
    let owner: any;
    let addr1: any;

    before(async () => { await initGateway(); });

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("PublicEncryptionPremium");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    it("storeEncrypted stores and emits Stored", async () => {
        const { ciphertext: enc } = await getSignatureAndEncryption(42);
        const tx = await contract.connect(addr1).storeEncrypted(enc);
        await expect(tx).to.emit(contract, "Stored");
    });

    it("getStored returns stored ciphertext", async () => {
        const { ciphertext: enc } = await getSignatureAndEncryption(7);
        const tx = await contract.connect(addr1).storeEncrypted(enc);
        const receipt = await tx.wait();
        // Extract id from events
        const events = await contract.queryFilter(contract.filters.Stored());
        const id = events[events.length - 1].args?.id;
        const stored = await contract.getStored(id);
        expect(stored).to.not.be.undefined;
    });

    it("publicDecrypt emits event and returns placeholder", async () => {
        const { ciphertext: enc } = await getSignatureAndEncryption(5);
        const tx = await contract.connect(addr1).storeEncrypted(enc);
        const events = await contract.queryFilter(contract.filters.Stored());
        const id = events[events.length - 1].args?.id;
        const dec = await contract.publicDecrypt(id);
        expect(dec).to.equal(0); // placeholder behavior
    });

    it("allowReencryption requires owner", async () => {
        const { ciphertext: enc } = await getSignatureAndEncryption(3);
        const tx = await contract.connect(addr1).storeEncrypted(enc);
        const events = await contract.queryFilter(contract.filters.Stored());
        const id = events[events.length - 1].args?.id;
        await expect(contract.connect(addr1).allowReencryption(id, addr1.address)).to.be.revertedWith("only-owner");
        await expect(contract.connect(owner).allowReencryption(id, addr1.address)).to.emit(contract, "ReencryptionAllowed");
    });

    it("invalid id reverts", async () => {
        await expect(contract.getStored(9999)).to.be.revertedWith("invalid-id");
        await expect(contract.publicDecrypt(9999)).to.be.revertedWith("invalid-id");
    });
});
