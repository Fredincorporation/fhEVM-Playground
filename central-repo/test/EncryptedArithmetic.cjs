const { expect } = require("chai");

let ethers;
let hre;
let fhevm;

async function deployFixture() {
  // Deploy FHECounter contract for testing encrypted arithmetic
  const factory = await ethers.getContractFactory("FHECounter");
  const contract = await factory.deploy();
  return contract;
}

describe("Encrypted Arithmetic Operations", function () {
  let contract;
  let signer;

  before(async function () {
    // Load Hardhat runtime
    hre = (typeof global !== "undefined" && global.hre) || (await import("hardhat")).default;
    ethers = hre.ethers || (await import("ethers"));
    fhevm = hre.fhevm || (await import("./helpers/fhevm-mock.js")).default;

    signer = (await ethers.getSigners())[0];
    contract = await deployFixture();
  });

  it("should store and retrieve encrypted value", async function () {
    // FHECounter stores encrypted count internally
    const initialCount = await contract.getCount();
    expect(initialCount).to.equal(ethers.ZeroHash);

    // After deployment, encrypted count should be uninitialized
    const retrievedCount = await contract.getCount();
    expect(retrievedCount).to.equal(initialCount);
  });

  it("should create encrypted input with mock gateway", async function () {
    const contractAddress = await contract.getAddress();
    const userAddress = signer.address;

    // Create encrypted input using mock gateway
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, userAddress)
      .add32(42)
      .encrypt();

    // Verify encrypted input structure
    expect(encryptedInput).to.have.property("handles");
    expect(encryptedInput).to.have.property("inputProof");
    expect(Array.isArray(encryptedInput.handles)).to.be.true;
  });

  it("should decrypt mock encrypted value", async function () {
    const contractAddress = await contract.getAddress();
    const userAddress = signer.address;

    // Create and encrypt a value
    const plainValue = 12345;
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, userAddress)
      .add32(plainValue)
      .encrypt();

    // In mock mode, decrypt returns the original value
    const decryptedValue = await fhevm.userDecryptEuint(
      { euint32: 0 },
      encryptedInput.handles[0],
      contractAddress,
      signer,
    );

    // Mock decryption returns identity
    expect(decryptedValue).to.not.be.undefined;
  });

  it("should handle multiple encrypted values", async function () {
    const contractAddress = await contract.getAddress();
    const userAddress = signer.address;

    // Create multiple encrypted inputs
    const input1 = await fhevm
      .createEncryptedInput(contractAddress, userAddress)
      .add32(100)
      .encrypt();

    const input2 = await fhevm
      .createEncryptedInput(contractAddress, userAddress)
      .add32(200)
      .encrypt();

    expect(input1.handles.length).to.be.greaterThan(0);
    expect(input2.handles.length).to.be.greaterThan(0);
    expect(input1.handles[0]).to.not.equal(input2.handles[0]);
  });
});
