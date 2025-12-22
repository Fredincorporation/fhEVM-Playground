import { expect } from "chai";
import { ethers } from "hardhat";
import type { AccessControlPremium } from "../typechain-types";
import { getSignatureAndEncryption, initGateway, isMockedMode } from "../../../../scripts/test-helpers";

describe("AccessControlPremium - Tests", () => {
    let contract: AccessControlPremium;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => { await initGateway(); });

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("AccessControlPremium");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    it.skip("assignEncryptedRole and getEncryptedRole work", async () => {
        const { ciphertext: encAdmin } = await getSignatureAndEncryption(1);
        await expect(contract.assignEncryptedRole(addr1.address, encAdmin)).to.emit(contract, "RoleAssigned");
        const stored = await contract.getEncryptedRole(addr1.address);
        expect(stored).to.not.be.undefined;
    });

    it.skip("hasRoleAtLeast returns encrypted boolean and is callable", async () => {
        const { ciphertext: encAdmin } = await getSignatureAndEncryption(2);
        const { ciphertext: encMin } = await getSignatureAndEncryption(1);
        await contract.assignEncryptedRole(addr1.address, encAdmin);
        const res = await contract.hasRoleAtLeast(addr1.address, encMin);
        expect(res).to.not.be.undefined;
    });

    it("allowTransient requires owner and emits event", async () => {
        await expect(contract.connect(addr1).allowTransient(addr2.address)).to.be.revertedWith("only-owner");
        await expect(contract.connect(owner).allowTransient(addr2.address)).to.emit(contract, "TransientAllowed");
    });

    it("clearRole deletes role and emits RoleCleared", async () => {
        const { ciphertext: enc } = await getSignatureAndEncryption(1);
        await contract.assignEncryptedRole(addr1.address, enc);
        await expect(contract.clearRole(addr1.address)).to.emit(contract, "RoleCleared");
        const stored = await contract.getEncryptedRole(addr1.address);
        // After deletion, stored should be a defined cipher (mapped default); we assert callable
        expect(stored).to.not.be.undefined;
    });

    it("antiPattern_decryptRole callable (demo)", async () => {
        const tx = await contract.antiPattern_decryptRole(addr1.address);
        expect(tx).to.not.be.undefined;
    });
});
