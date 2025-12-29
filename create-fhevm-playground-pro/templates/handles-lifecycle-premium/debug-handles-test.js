const ethers = require("ethers");
const fs = require("fs");

// Load the compiled contract
const contractArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/HandlesLifecyclePremium.sol/HandlesLifecyclePremium.json", "utf8"));

// Create interface
const iface = new ethers.Interface(contractArtifact.abi);

// Find the event
const events = contractArtifact.abi.filter(a => a.type === "event");
console.log("Events in contract:");
events.forEach(e => {
  console.log(`- ${e.name}`);
  if (e.name === "HandleCreated") {
    console.log("  Inputs:");
    e.inputs.forEach((inp, idx) => {
      console.log(`    [${idx}] ${inp.name}: ${inp.type} (indexed: ${inp.indexed})`);
    });
  }
});
