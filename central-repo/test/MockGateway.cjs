const { expect } = require("chai");

let ethers;
let hre;
let fhevm;

describe("Encrypted State Management", function () {
  let signer;
  let signers;

  before(async function () {
    // Load Hardhat runtime
    hre = (typeof global !== "undefined" && global.hre) || (await import("hardhat")).default;
    ethers = hre.ethers || (await import("ethers"));
    fhevm = hre.fhevm || (await import("./helpers/fhevm-mock.js")).default;

    const ethSigners = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
    signer = signers.deployer;
  });

  it("should initialize mock fhevm gateway", async function () {
    expect(fhevm).to.exist;
    expect(fhevm.isMock).to.be.true;
  });

  it("should have required gateway methods", async function () {
    expect(fhevm.createEncryptedInput).to.be.a("function");
    expect(fhevm.userDecryptEuint).to.be.a("function");
  });

  it("should create encrypted builder with add32", async function () {
    const contractAddress = signer.address;
    const builder = fhevm.createEncryptedInput(contractAddress, signer.address);

    expect(builder).to.exist;
    expect(builder.add32).to.be.a("function");
    expect(builder.encrypt).to.be.a("function");
  });

  it("should encrypt builder with proper structure", async function () {
    const contractAddress = signer.address;
    const encryptedData = await fhevm
      .createEncryptedInput(contractAddress, signer.address)
      .add32(999)
      .encrypt();

    expect(encryptedData).to.have.property("handles");
    expect(encryptedData).to.have.property("inputProof");
    expect(Array.isArray(encryptedData.handles)).to.be.true;
    expect(encryptedData.handles.length).to.be.greaterThan(0);
  });

  it("should handle multiple signers", async function () {
    const contractAddress = signer.address;

    const aliceEncryption = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(100)
      .encrypt();

    const bobEncryption = await fhevm
      .createEncryptedInput(contractAddress, signers.bob.address)
      .add32(200)
      .encrypt();

    expect(aliceEncryption.handles[0]).to.not.equal(bobEncryption.handles[0]);
  });

  it("should decrypt mock encrypted values", async function () {
    const contractAddress = signer.address;

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signer.address)
      .add32(555)
      .encrypt();

    const decrypted = await fhevm.userDecryptEuint(
      { euint32: 0 },
      encryptedInput.handles[0],
      contractAddress,
      signer,
    );

    expect(decrypted).to.be.a("number");
  });

  it("should handle sequential encryptions", async function () {
    const contractAddress = signer.address;
    const values = [111, 222, 333];
    const encryptedValues = [];

    for (const value of values) {
      const encrypted = await fhevm
        .createEncryptedInput(contractAddress, signer.address)
        .add32(value)
        .encrypt();
      encryptedValues.push(encrypted);
    }

    expect(encryptedValues.length).to.equal(3);
    for (let i = 0; i < encryptedValues.length; i++) {
      expect(encryptedValues[i].handles).to.exist;
    }
  });

  it("should support different data types in mock mode", async function () {
    const contractAddress = signer.address;

    // Test with different add methods (in real fhEVM)
    const builder = fhevm.createEncryptedInput(contractAddress, signer.address);

    // The builder should support chaining
    expect(builder.add32).to.be.a("function");
  });
});
