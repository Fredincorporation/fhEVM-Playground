import { expect } from "chai";
import { ethers } from "hardhat";
import type { ArithmeticPremium } from "../typechain-types";
import { getSignatureAndEncryption, initGateway, isMockedMode } from "../../../../scripts/test-helpers";

describe("ArithmeticPremium - Premium Tests", () => {
    let contract: ArithmeticPremium;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        await initGateway();
    });

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("ArithmeticPremium");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    describe("Deployment", () => {
        it("deploys successfully", async () => {
            expect(await contract.getAddress()).to.be.properAddress;
        });

        it("initial A and B are encrypted zeros", async () => {
            const a = await contract.getA();
            const b = await contract.getB();
            expect(a).to.not.be.undefined;
            expect(b).to.not.be.undefined;
        });
    });

    describe("Setters", () => {
        it.skip("sets A and emits event", async () => {
            const { ciphertext: enc10 } = await getSignatureAndEncryption(10);
            const tx = await contract.setA(enc10);
            await expect(tx).to.emit(contract, "ASet");
        });

        it.skip("sets B and emits event", async () => {
            const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
            const tx = await contract.setB(enc5);
            await expect(tx).to.emit(contract, "BSet");
        });

        it.skip("allows different callers to set values", async () => {
            const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
            const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
            await expect(contract.connect(addr1).setA(enc1)).to.emit(contract, "ASet");
            await expect(contract.connect(addr2).setB(enc2)).to.emit(contract, "BSet");
        });
    });

    describe("Arithmetic Ops", () => {
        it.skip("addAB performs encrypted addition and emits Added", async () => {
            const { ciphertext: enc7 } = await getSignatureAndEncryption(7);
            const { ciphertext: enc3 } = await getSignatureAndEncryption(3);
            await contract.setA(enc7);
            await contract.setB(enc3);
            const tx = await contract.addAB();
            await expect(tx).to.emit(contract, "Added");
        });

        it.skip("subAB performs encrypted subtraction and emits Subtracted", async () => {
            const { ciphertext: enc7 } = await getSignatureAndEncryption(7);
            const { ciphertext: enc3 } = await getSignatureAndEncryption(3);
            await contract.setA(enc7);
            await contract.setB(enc3);
            const tx = await contract.subAB();
            await expect(tx).to.emit(contract, "Subtracted");
        });

        it.skip("mulAB performs encrypted multiplication and emits Multiplied", async () => {
            const { ciphertext: enc4 } = await getSignatureAndEncryption(4);
            const { ciphertext: enc6 } = await getSignatureAndEncryption(6);
            await contract.setA(enc4);
            await contract.setB(enc6);
            const tx = await contract.mulAB();
            await expect(tx).to.emit(contract, "Multiplied");
        });

        it.skip("mulAByConstant multiplies A by small constant", async () => {
            const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
            await contract.setA(enc2);
            const tx = await contract.mulAByConstant(5);
            await expect(tx).to.emit(contract, "Multiplied");
        });

        it.skip("mulAByConstant rejects large factor", async () => {
            const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
            await contract.setA(enc1);
            await expect(contract.mulAByConstant(1000)).to.be.revertedWith("factor-too-large");
        });
    });

    describe("Anti-patterns and Edge Cases", () => {
        it("antiPattern_decryptThenCompute exists and can be called (demo)", async () => {
            const tx = await contract.antiPattern_decryptThenCompute(10);
            expect(tx).to.not.be.undefined;
        });

        it("antiPattern_heavyMultiply exists and can be called (demo)", async () => {
            const tx = await contract.antiPattern_heavyMultiply();
            expect(tx).to.not.be.undefined;
        });

        it("handles large operands without reverting (wrap behavior)", async () => {
            const max = "4294967295";
            const { ciphertext: encMax } = await getSignatureAndEncryption(max);
            await contract.setA(encMax);
            await contract.setB(encMax);
            const tx = await contract.addAB();
            await expect(tx).to.emit(contract, "Added");
        });
    });

    describe("Owner helpers", () => {
        it("only owner can set new owner", async () => {
            const currentOwner = owner.address;
            await expect(contract.setOwner(addr1.address)).to.not.be.reverted;
            // now owner is addr1
            await expect(contract.connect(addr1).setOwner(addr2.address)).to.not.be.reverted;
        });

        it("non-owner cannot set owner", async () => {
            await expect(contract.connect(addr1).setOwner(addr2.address)).to.be.revertedWith("only-owner");
        });
    });

    describe("Events and Gas", () => {
        it.skip("emits events for add/sub/mul", async () => {
            const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
            const { ciphertext: enc3 } = await getSignatureAndEncryption(3);
            await contract.setA(enc2);
            await contract.setB(enc3);
            await expect(contract.addAB()).to.emit(contract, "Added");
            await expect(contract.subAB()).to.emit(contract, "Subtracted");
            await expect(contract.mulAB()).to.emit(contract, "Multiplied");
        });

        it.skip("addAB gas usage is reasonable", async () => {
            const { ciphertext: enc1 } = await getSignatureAndEncryption(1);
            const { ciphertext: enc2 } = await getSignatureAndEncryption(2);
            await contract.setA(enc1);
            await contract.setB(enc2);
            const tx = await contract.addAB();
            const receipt = await tx.wait();
            expect(receipt.gasUsed.toNumber()).to.be.lessThan(150000);
        });
    });

    describe("Comprehensive Scenario", () => {
        it.skip("complete flow: set -> add -> mul -> sub", async () => {
            const { ciphertext: enc10 } = await getSignatureAndEncryption(10);
            const { ciphertext: enc5 } = await getSignatureAndEncryption(5);
            await contract.setA(enc10);
            await contract.setB(enc5);
            await contract.addAB();
            await contract.mulAB();
            await contract.subAB();
            // No revert indicates correctness of flow
        });
    });
});
