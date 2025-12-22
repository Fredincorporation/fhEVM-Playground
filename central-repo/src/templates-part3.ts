/**
 * Templates Part 3: Access Control, Input Proofs, Anti-patterns, Handles
 * Includes: access-control, input-verification-proofs, anti-patterns-guide, handles-lifecycle
 */

export function accessControlContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

contract AccessControl {
    enum Role { NONE, USER, ADMIN, OPERATOR }

    mapping(address => Role) public userRoles;
    mapping(address => euint32) private secretBalances;
    address public owner;

    event RoleAssigned(address indexed user, uint8 role);

    constructor() {
        owner = msg.sender;
        userRoles[msg.sender] = Role.ADMIN;
    }

    function assignRole(address _user, Role _role) external {
        require(userRoles[msg.sender] == Role.ADMIN, "Not admin");
        userRoles[_user] = _role;
        emit RoleAssigned(_user, uint8(_role));
    }

    function setSecretBalance(address _user, bytes calldata _encrypted) external {
        require(userRoles[msg.sender] == Role.ADMIN, "Not admin");
        secretBalances[_user] = TFHE.asEuint32(_encrypted);
    }

    function getSecretBalance(address _user) external view returns (euint32) {
        require(msg.sender == owner || msg.sender == _user, "Unauthorized");
        return secretBalances[_user];
    }

    function operatorAction() external view returns (bool) {
        require(
            userRoles[msg.sender] == Role.OPERATOR || userRoles[msg.sender] == Role.ADMIN,
            "Only operator"
        );
        return true;
    }
}
\`;
}

export function accessControlTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("AccessControl", function () {
  let accessControl: any;
  let owner: any;
  let user1: any;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
  });

  it("Should deploy with owner as admin", async function () {
    const role = await accessControl.userRoles(owner.address);
    expect(role).to.equal(2);
  });

  it("Should assign roles", async function () {
    await accessControl.assignRole(user1.address, 1);
    const role = await accessControl.userRoles(user1.address);
    expect(role).to.equal(1);
  });

  it("Should restrict secret balance access", async function () {
    const [, user2] = await ethers.getSigners();
    await accessControl.setSecretBalance(user1.address, "0x");
    await expect(
      accessControl.connect(user2).getSecretBalance(user1.address)
    ).to.be.revertedWith("Unauthorized");
  });
});
\`;
}

export function inputVerificationProofsContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

contract InputVerificationProofs {
    euint32 private validatedValue;
    mapping(address => uint256) public submissionCount;

    event InputValidated(address indexed user, uint256 count);

    function submitWithProof(bytes calldata _encrypted) external {
        euint32 encValue = TFHE.asEuint32(_encrypted);
        ebool isInRange = TFHE.le(encValue, TFHE.asEuint32(1000000));
        ebool isPositive = TFHE.gt(encValue, TFHE.asEuint32(0));

        validatedValue = TFHE.select(isInRange, encValue, TFHE.asEuint32(0));
        submissionCount[msg.sender]++;

        emit InputValidated(msg.sender, submissionCount[msg.sender]);
    }

    function isNonZero() external view returns (ebool) {
        return TFHE.ne(validatedValue, TFHE.asEuint32(0));
    }

    function getSubmissionCount(address _user) external view returns (uint256) {
        return submissionCount[_user];
    }
}
\`;
}

export function inputVerificationProofsTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("InputVerificationProofs", function () {
  let inputProof: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const InputProof = await ethers.getContractFactory("InputVerificationProofs");
    inputProof = await InputProof.deploy();
  });

  it("Should accept valid input", async function () {
    await expect(inputProof.submitWithProof("0x")).to.not.be.reverted;
  });

  it("Should increment submission count", async function () {
    await inputProof.submitWithProof("0x");
    const count = await inputProof.getSubmissionCount(owner.address);
    expect(count).to.equal(1);
  });
});
\`;
}

export function antiPatternsGuideContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

contract AntiPatternsGuide {
    euint32 private secret;

    event BadDecryption(uint32 value);

    function badDecryptionPattern(bytes calldata _encrypted) external {
        euint32 enc = TFHE.asEuint32(_encrypted);
        uint32 plaintext = TFHE.decrypt(enc);
        emit BadDecryption(plaintext);
    }

    function badConditionalPattern(bytes calldata _enc) external pure returns (euint32) {
        euint32 value = TFHE.asEuint32(_enc);
        ebool cond = TFHE.gt(value, TFHE.asEuint32(100));
        return TFHE.select(cond, value, TFHE.asEuint32(0));
    }

    function correctPattern(bytes calldata _encrypted) external returns (euint32) {
        euint32 value = TFHE.asEuint32(_encrypted);
        return TFHE.add(value, TFHE.asEuint32(10));
    }
}
\`;
}

export function antiPatternsGuideTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("AntiPatternsGuide", function () {
  let antiPatterns: any;

  beforeEach(async function () {
    const AntiPatterns = await ethers.getContractFactory("AntiPatternsGuide");
    antiPatterns = await AntiPatterns.deploy();
  });

  it("Should deploy successfully", async function () {
    expect(antiPatterns.address).to.exist;
  });

  it("Should demonstrate correct pattern", async function () {
    const result = await antiPatterns.correctPattern("0x");
    expect(result).to.exist;
  });
});
\`;
}

export function handlesLifecycleContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

contract HandlesLifecycle {
    struct EncryptedHandle {
        euint32 value;
        address owner;
        uint256 createdAt;
        bool isActive;
    }

    mapping(uint256 => EncryptedHandle) public handles;
    uint256 public handleCounter;

    event HandleCreated(uint256 indexed handleId, address indexed owner);
    event HandleUsed(uint256 indexed handleId, uint256 timestamp);
    event HandleDestroyed(uint256 indexed handleId);

    function createHandle(bytes calldata _encrypted) external returns (uint256) {
        uint256 handleId = handleCounter++;
        handles[handleId] = EncryptedHandle({
            value: TFHE.asEuint32(_encrypted),
            owner: msg.sender,
            createdAt: block.timestamp,
            isActive: true
        });
        emit HandleCreated(handleId, msg.sender);
        return handleId;
    }

    function useHandle(uint256 _handleId) external returns (euint32) {
        EncryptedHandle storage handle = handles[_handleId];
        require(handle.isActive, "Handle inactive");
        require(handle.owner == msg.sender, "Not owner");
        emit HandleUsed(_handleId, block.timestamp);
        return TFHE.add(handle.value, TFHE.asEuint32(1));
    }

    function destroyHandle(uint256 _handleId) external {
        EncryptedHandle storage handle = handles[_handleId];
        require(handle.owner == msg.sender, "Not owner");
        handle.isActive = false;
        emit HandleDestroyed(_handleId);
    }

    function isHandleValid(uint256 _handleId) external view returns (bool) {
        return handles[_handleId].isActive;
    }

    function getHandleAge(uint256 _handleId) external view returns (uint256) {
        require(handles[_handleId].isActive, "Handle inactive");
        return block.timestamp - handles[_handleId].createdAt;
    }
}
\`;
}

export function handlesLifecycleTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("HandlesLifecycle", function () {
  let handles: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const HandlesLifecycle = await ethers.getContractFactory("HandlesLifecycle");
    handles = await HandlesLifecycle.deploy();
  });

  it("Should create handle", async function () {
    await expect(handles.createHandle("0x")).to.not.be.reverted;
    expect(await handles.handleCounter()).to.equal(1);
  });

  it("Should use handle", async function () {
    await handles.createHandle("0x");
    const result = await handles.useHandle(0);
    expect(result).to.exist;
  });

  it("Should destroy handle", async function () {
    await handles.createHandle("0x");
    await handles.destroyHandle(0);
    expect(await handles.isHandleValid(0)).to.be.false;
  });
});
\`;
}
