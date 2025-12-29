import { expect } from "chai";
import hre from "hardhat";

import { initGateway, getSignatureAndEncryption, isMockedMode } from "../scripts/test-helpers.ts";


describe("HandlesLifecyclePremium", function () {
  let handles: any;
  let owner: any;
  let other: any;

  beforeEach(async () => {
    await initGateway();
    [owner, other] = await hre.ethers.getSigners();
    const Factory = await ethers.getContractFactory("HandlesLifecyclePremium");
    handles = await Factory.deploy();
    await handles.waitForDeployment();
  });

  it("creates a handle and exposes owner before expiry", async () => {
    const { ciphertext } = await getSignatureAndEncryption(42);
    const tx = await handles.connect(owner).createHandle(ciphertext, 3600);
    const rc = await tx.wait();
    
    const iface = handles.interface;
    // Debug: Check all logs
    const evt = rc?.logs
      ?.map((log: any) => {
        try {
          const parsed = iface.parseLog(log);
          return parsed;
        } catch (e) {
          return null;
        }
      })
      ?.find((e: any) => e?.name === "HandleCreated");
    expect(evt).to.exist;
    const handleId = evt?.args[0];
    const ownerAddr = await handles.ownerOf(handleId);
    expect(ownerAddr).to.equal(owner.address);
  });

  it("transfers a handle to another owner", async () => {
    const { ciphertext } = await getSignatureAndEncryption(7);
    const rc = await (await handles.createHandle(ciphertext, 0)).wait();
    const iface = handles.interface;
    const evt = rc?.logs
      ?.map((log: any) => {
        try {
          return iface.parseLog(log);
        } catch {
          return null;
        }
      })
      ?.find((e: any) => e?.name === "HandleCreated");
    const handleId = evt?.args[0];
    // try to transfer as non-owner (should fail)
    await expect(handles.connect(other).transferHandle(handleId, other.address)).to.be.revertedWith("not-owner");
    // transfer as owner (should succeed)
    await handles.connect(owner).transferHandle(handleId, other.address);
    const newOwner = await handles.ownerOf(handleId);
    expect(newOwner).to.equal(other.address);
  });

  it("expires handle after ttl and metadata becomes inaccessible", async () => {
    const { ciphertext } = await getSignatureAndEncryption(9);
    const rc = await (await handles.createHandle(ciphertext, 1)).wait();
    const iface = handles.interface;
    const evt = rc?.logs
      ?.map((log: any) => {
        try {
          return iface.parseLog(log);
        } catch {
          return null;
        }
      })
      ?.find((e: any) => e?.name === "HandleCreated");
    const handleId = evt?.args[0];
    // advance time by 2 seconds
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);
    expect(await handles.isExpired(handleId)).to.equal(true);
    await expect(handles.metadataOf(handleId)).to.be.revertedWith("expired");
  });
});
