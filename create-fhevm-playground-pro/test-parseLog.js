const ethers = require("ethers");

// Simulate what parseLog returns - it returns a LogDescription with args as Result
const abi = [
  {
    type: "event",
    name: "HandleCreated",
    inputs: [
      { indexed: true, name: "handleId", type: "bytes32" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "expiresAt", type: "uint64" }
    ]
  }
];

const iface = new ethers.Interface(abi);

// Create a fake log
const fakeLogData = ethers.AbiCoder.defaultAbiCoder().encode(
  ["uint64"],
  [3600]
);

const fakeLog = {
  address: "0x0000000000000000000000000000000000000001",
  topics: [
    iface.getEvent("HandleCreated").topicHash,
    "0x" + "1111111111111111111111111111111111111111111111111111111111111111", // handleId
    "0x" + "0000000000000000000000000000000000000000000000000000000000000001"  // owner (address as uint256)
  ],
  data: fakeLogData,
  blockNumber: 1,
  transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  transactionIndex: 0,
  blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  logIndex: 0,
  removed: false
};

const parsed = iface.parseLog(fakeLog);
console.log("Parsed log name:", parsed.name);
console.log("args[0] (handleId):", parsed.args[0]);
console.log("args.handleId:", parsed.args.handleId);
console.log("args[1] (owner):", parsed.args[1]);
console.log("args.owner:", parsed.args.owner);
console.log("args[2] (expiresAt):", parsed.args[2]);
console.log("args.expiresAt:", parsed.args.expiresAt);
