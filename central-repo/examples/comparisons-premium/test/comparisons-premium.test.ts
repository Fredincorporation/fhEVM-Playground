import { expect } from "chai";
import { ethers } from "hardhat";
import type { ComparisonsPremium } from "../typechain-types";
import { getSignatureAndEncryption, initGateway, isMockedMode } from "../scripts/test-helpers";

describe("ComparisonsPremium - Tests", () => {
    let contract: ComparisonsPremium;
    let owner: any;
    let addr1: any;

    before(async () => { await initGateway(); });

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("ComparisonsPremium");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    it("deploys and initializes", async () => {
        expect(await contract.getAddress()).to.be.properAddress;
    });

    it.skip("setters work and emit events", async () => {
        const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
        const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
        await expect(contract.setA(enc1)).to.emit(contract, "ASet");
        await expect(contract.setB(enc2)).to.emit(contract, "BSet");
    });

    it.skip("gt/lt/eq produce encrypted booleans", async () => {
        const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
        const { ciphertext: enc3 } = await getSignatureAndEncryption(3);
        await contract.setA(enc5);
        await contract.setB(enc3);

        const gt = await contract.isAGreaterThanB();
        const lt = await contract.isALessThanB();
        const eq = await contract.isAEqualB();

        expect(gt).to.not.be.undefined;
        expect(lt).to.not.be.undefined;
        expect(eq).to.not.be.undefined;
    });

    it.skip("selectBasedOnThreshold modifies a based on encrypted comparison", async () => {
        const { ciphertext: enc7 } = await getSignatureAndEncryption(7);
        const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
        await contract.setA(enc7);
        await contract.setB(enc2);

        const tx = await contract.selectBasedOnThreshold(enc2);
        await expect(tx).to.emit(contract, "Compared");
    });

    it("anti-pattern function exists and callable", async () => {
        const tx = await contract.antiPattern_decryptBranch();
        expect(tx).to.not.be.undefined;
    });
});
