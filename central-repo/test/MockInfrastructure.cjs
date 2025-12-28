const { expect } = require("chai");

let ethers;
let hre;
let fhevm;

describe("fhEVM Mock Test Infrastructure", function () {
  let signers;
  let signer;

  before(async function () {
    // Load Hardhat runtime
    hre = (typeof global !== "undefined" && global.hre) || (await import("hardhat")).default;
    ethers = hre.ethers || (await import("ethers"));
    fhevm = hre.fhevm || (await import("./helpers/fhevm-mock.js")).default;

    const ethSigners = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
      charlie: ethSigners[3],
    };
    signer = signers.deployer;
  });

  describe("Hardhat Environment", function () {
    it("should have ethers library available", async function () {
      expect(ethers).to.exist;
      expect(ethers.getSigners).to.be.a("function");
      expect(ethers.getContractFactory).to.be.a("function");
    });

    it("should have multiple signers", async function () {
      expect(signers.deployer).to.exist;
      expect(signers.alice).to.exist;
      expect(signers.bob).to.exist;
      expect(signers.deployer.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("should have distinct signer addresses", async function () {
      expect(signers.deployer.address).to.not.equal(signers.alice.address);
      expect(signers.alice.address).to.not.equal(signers.bob.address);
    });
  });

  describe("fhEVM Mock Gateway", function () {
    it("should expose mock flag", async function () {
      expect(fhevm.isMock).to.be.true;
    });

    it("should provide encrypted input creator", async function () {
      const builder = fhevm.createEncryptedInput(signer.address, signer.address);
      expect(builder).to.exist;
      expect(builder.add32).to.be.a("function");
      expect(builder.encrypt).to.be.a("function");
    });

    it("should create properly structured encrypted inputs", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(signer.address, signer.address)
        .add32(42)
        .encrypt();

      expect(encrypted).to.have.property("handles");
      expect(encrypted).to.have.property("inputProof");
      expect(Array.isArray(encrypted.handles)).to.be.true;
    });

    it("should provide decryption function", async function () {
      expect(fhevm.userDecryptEuint).to.be.a("function");

      const encrypted = await fhevm
        .createEncryptedInput(signer.address, signer.address)
        .add32(123)
        .encrypt();

      const decrypted = await fhevm.userDecryptEuint(
        { euint32: 0 },
        encrypted.handles[0],
        signer.address,
        signer,
      );

      expect(decrypted).to.be.a("number");
    });
  });

  describe("Contract Deployment in Mock Mode", function () {
    it("should deploy FHECounter contract", async function () {
      const factory = await ethers.getContractFactory("FHECounter");
      const contract = await factory.deploy();
      const address = await contract.getAddress();

      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("should access deployed contract methods", async function () {
      const factory = await ethers.getContractFactory("FHECounter");
      const contract = await factory.deploy();

      const count = await contract.getCount();
      expect(count).to.equal(ethers.ZeroHash);
    });

    it("should connect contract to different signers", async function () {
      const factory = await ethers.getContractFactory("FHECounter");
      const contract = await factory.deploy();

      const connectedToAlice = contract.connect(signers.alice);
      expect(connectedToAlice).to.exist;

      const connectedToBob = contract.connect(signers.bob);
      expect(connectedToBob).to.exist;
    });
  });

  describe("Multi-User Encrypted Operations", function () {
    it("should handle encrypted inputs from multiple users", async function () {
      const contractAddress = signer.address;
      const encryptedValues = [];

      for (const user of [signers.deployer, signers.alice, signers.bob]) {
        const encrypted = await fhevm
          .createEncryptedInput(contractAddress, user.address)
          .add32(Math.floor(Math.random() * 1000))
          .encrypt();
        encryptedValues.push(encrypted);
      }

      expect(encryptedValues.length).to.equal(3);
      // Verify uniqueness
      expect(encryptedValues[0].handles[0]).to.not.equal(encryptedValues[1].handles[0]);
      expect(encryptedValues[1].handles[0]).to.not.equal(encryptedValues[2].handles[0]);
    });

    it("should track encrypted operations for different contracts", async function () {
      const contractA = signer.address;
      const contractB = signers.alice.address;

      const encryptedForA = await fhevm
        .createEncryptedInput(contractA, signer.address)
        .add32(100)
        .encrypt();

      const encryptedForB = await fhevm
        .createEncryptedInput(contractB, signer.address)
        .add32(100)
        .encrypt();

      // Both encrypted inputs should have valid structure
      expect(encryptedForA.handles).to.exist;
      expect(encryptedForB.handles).to.exist;
      expect(Array.isArray(encryptedForA.handles)).to.be.true;
      expect(Array.isArray(encryptedForB.handles)).to.be.true;
    });
  });

  describe("Edge Cases in Mock Mode", function () {
    it("should handle zero values in encryption", async function () {
      const encrypted = await fhevm
        .createEncryptedInput(signer.address, signer.address)
        .add32(0)
        .encrypt();

      const decrypted = await fhevm.userDecryptEuint(
        { euint32: 0 },
        encrypted.handles[0],
        signer.address,
        signer,
      );

      expect(decrypted).to.be.a("number");
    });

    it("should handle large values in encryption", async function () {
      const maxUint32 = Math.pow(2, 32) - 1;
      const encrypted = await fhevm
        .createEncryptedInput(signer.address, signer.address)
        .add32(maxUint32)
        .encrypt();

      expect(encrypted.handles).to.exist;
      expect(encrypted.inputProof).to.exist;
    });

    it("should maintain encryption consistency across calls", async function () {
      const value = 777;
      const contractAddress = signer.address;

      const enc1 = await fhevm
        .createEncryptedInput(contractAddress, signer.address)
        .add32(value)
        .encrypt();

      const enc2 = await fhevm
        .createEncryptedInput(contractAddress, signer.address)
        .add32(value)
        .encrypt();

      // Mock mode is deterministic - same inputs produce same handles
      expect(enc1.handles[0]).to.equal(enc2.handles[0]);
      expect(enc1.inputProof).to.equal(enc2.inputProof);
    });
  });
});
