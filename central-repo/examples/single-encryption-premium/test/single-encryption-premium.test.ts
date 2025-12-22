import { expect } from "chai";
import { ethers } from "hardhat";
import type { SingleEncryption } from "../typechain-types";
import { getSignatureAndEncryption, initGateway, isMockedMode } from "../../../../scripts/test-helpers";

describe("SingleEncryptionPremium - Tests", () => {
    let contract: SingleEncryptionPremium;
    let owner: any;
    let addr1: any;
    let addr2: any;
    let addr3: any;

    before(async () => { await initGateway(); });

    beforeEach(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("SingleEncryptionPremium");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    it.skip("allows submission of encrypted values and emits event", async () => {
        const { ciphertext: enc10 } = await getSignatureAndEncryption(10);
        await expect(contract.connect(addr1).submitEncrypted(enc10)).to.emit(contract, "Submitted");
    });

    it.skip("aggregate returns encrypted zero for empty list", async () => {
        const dummy: string[] = [];
        const sum = await contract.aggregate(dummy);
        expect(sum).to.not.be.undefined;
    });

    it.skip("aggregate sums submitted values", async () => {
        const { ciphertext: enc3 } = await getSignatureAndEncryption(3);
        const { ciphertext: enc7 } = await getSignatureAndEncryption(7);
        await contract.connect(addr1).submitEncrypted(enc3);
        await contract.connect(addr2).submitEncrypted(enc7);

        const sum = await contract.aggregate([addr1.address, addr2.address]);
        expect(sum).to.not.be.undefined;
    });

    it.skip("aggregateAll works when under MAX_AGGREGATE", async () => {
        const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
        await contract.connect(addr1).submitEncrypted(enc1);
        const res = await contract.aggregateAll();
        expect(res).to.not.be.undefined;
    });

    it("aggregate reverts when too many addresses", async () => {
        const arr: string[] = [];
        for (let i = 0; i < 25; i++) { arr.push(owner.address); }
        await expect(contract.aggregate(arr)).to.be.revertedWith("too-many-addrs");
    });

    it.skip("clearSubmissions clears data (owner only)", async () => {
        const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
        await contract.connect(addr1).submitEncrypted(enc2);
        await expect(contract.connect(owner).clearSubmissions()).to.emit(contract, "Cleared");
        const count = await contract.getSubmittersCount();
        expect(count.toNumber()).to.equal(0);
    });

    it("non-owner cannot clear submissions", async () => {
        await expect(contract.connect(addr1).clearSubmissions()).to.be.revertedWith("only-owner");
    });

    it.skip("getEncryptedFor returns stored encrypted value", async () => {
        const { ciphertext: enc9 } = await getSignatureAndEncryption(9);
        await contract.connect(addr2).submitEncrypted(enc9);
        const stored = await contract.getEncryptedFor(addr2.address);
        expect(stored).to.not.be.undefined;
    });

    it.skip("submitters count increases and overwriting preserves count", async () => {
        const { ciphertext: enc4 } = await getSignatureAndEncryption(4);
        await contract.connect(addr1).submitEncrypted(enc4);
        let count = await contract.getSubmittersCount();
        expect(count.toNumber()).to.equal(1);
        // Overwrite
        const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
        await contract.connect(addr1).submitEncrypted(enc5);
        count = await contract.getSubmittersCount();
        expect(count.toNumber()).to.equal(1);
    });

    it("antiPattern_unboundedAggregation exists and callable", async () => {
        const tx = await contract.antiPattern_unboundedAggregation([owner.address]);
        expect(tx).to.not.be.undefined;
    });
});
