const ethers = require("ethers");
const fs = require("fs");

// Load the compiled contract
const contractArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/HandlesLifecyclePremium.sol/HandlesLifecyclePremium.json", "utf8"));
const iface = new ethers.Interface(contractArtifact.abi);

// Simulate a real log from the event
// HandleCreated(bytes32 indexed handleId, address indexed owner, uint64 expiresAt)
const eventSig = iface.getEvent("HandleCreated");
console.log("Event signature hash:", eventSig.topicHash);

// Create a fake log with indexed parameters
const expiresAt = 3600;
const fakeLog = {
  address: "0x1234567890123456789012345678901234567890",
  topics: [
    eventSig.topicHash,
    "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", // handleId (indexed)
    "0x000000000000000000000000abcdefabcdefabcdefabcdefabcdefabcdefabcd" // owner address (indexed, padded to 32 bytes)
  ],
  data: ethers.AbiCoder.defaultAbiCoder().encode(["uint64"], [expiresAt]),
  blockNumber: 1,
  transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  transactionIndex: 0,
  blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  logIndex: 0,
  removed: false
};

const parsed = iface.parseLog(fakeLog);
console.log("\nParsed log:");
console.log("- name:", parsed.name);
console.log("- args length:", parsed.args.length);
console.log("- args[0] (handleId via index):", parsed.args[0]);
console.log("- args[1] (owner via index):", parsed.args[1]);
console.log("- args[2] (expiresAt via index):", parsed.args[2]);
console.log("\nVia property names:");
console.log("- args.handleId:", parsed.args.handleId);
console.log("- args.owner:", parsed.args.owner);
console.log("- args.expiresAt:", parsed.args.expiresAt);
