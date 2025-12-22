import { expect } from "chai";
import { ethers } from "hardhat";
import type { InputProofsPremium } from "../typechain-types";
import { getSignatureAndEncryption, initGateway } from "fhevm";

describe("InputProofsPremium - Tests", () => {
    let contract: InputProofsPremium;
    let owner: any;
    let alice: any;

    before(async () => { await initGateway(); });

    beforeEach(async () => {
        [owner, alice] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("InputProofsPremium");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    it("allows submission of encrypted values", async () => {
        const { ciphertext: enc10 } = await getSignatureAndEncryption(10);
        await expect(contract.connect(alice).submit(enc10)).to.emit(contract, "Submitted");
    });

    it("verifyRange returns encrypted boolean (callable)", async () => {
        const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
        const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
        const { ciphertext: enc10 } = await getSignatureAndEncryption(10);

        await contract.connect(alice).submit(enc5);
        const res = await contract.verifyRange(alice.address, enc1, enc10);
        expect(res).to.not.be.undefined;
    });

    it("verifyComposite returns encrypted boolean for combined checks", async () => {
        const { ciphertext: enc7 } = await getSignatureAndEncryption(7);
        const { ciphertext: enc4 } = await getSignatureAndEncryption(4);
        const { ciphertext: enc10 } = await getSignatureAndEncryption(10);

        await contract.connect(alice).submit(enc7);
        const res = await contract.verifyComposite(alice.address, enc4, enc10, enc4);
        expect(res).to.not.be.undefined;
    });

    it("antiPattern_decryptAndCheck callable (demo only)", async () => {
        const tx = await contract.antiPattern_decryptAndCheck(alice.address, 1, 10);
        expect(tx).to.not.be.undefined;
    });

    it("getSubmitted returns ciphertext after submission", async () => {
        const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
        await contract.connect(alice).submit(enc2);
        const stored = await contract.getSubmitted(alice.address);
        expect(stored).to.not.be.undefined;
    });
});
