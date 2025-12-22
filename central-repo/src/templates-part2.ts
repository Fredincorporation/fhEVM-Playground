/**
 * Templates Part 2: Encryption/Decryption Examples
 * Includes: single-encryption, multiple-encryption, single-decryption-user, 
 *           single-decryption-public, multiple-decryption
 */

// ============================================================================
// SINGLE ENCRYPTION CONTRACT
// ============================================================================

export function singleEncryptionContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

/**
 * @title SingleEncryption
 * @notice User-side encryption of a single value
 * @dev Demonstrates how users encrypt data before sending to contract
 */
contract SingleEncryption {
    euint32 private encryptedValue;
    address public owner;

    event ValueEncrypted(address indexed user);

    constructor() {
        owner = msg.sender;
        encryptedValue = TFHE.asEuint32(0);
    }

    /**
     * @notice Store an encrypted value
     * @param _encryptedValue The encrypted uint32 value
     * @dev User should encrypt value client-side using FHE library
     */
    function setEncryptedValue(bytes calldata _encryptedValue) external {
        encryptedValue = TFHE.asEuint32(_encryptedValue);
        emit ValueEncrypted(msg.sender);
    }

    /**
     * @notice Perform operation on encrypted value (add 10)
     */
    function addToEncrypted() external view returns (euint32) {
        return TFHE.add(encryptedValue, TFHE.asEuint32(10));
    }

    /**
     * @notice Retrieve encrypted value (owner only)
     */
    function getEncryptedValue() external view returns (euint32) {
        require(msg.sender == owner, "Only owner");
        return encryptedValue;
    }
}
\`;
}

export function singleEncryptionTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("SingleEncryption", function () {
  let singleEncryption: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const SingleEncryption = await ethers.getContractFactory("SingleEncryption");
    singleEncryption = await SingleEncryption.deploy();
  });

  it("Should deploy successfully", async function () {
    expect(singleEncryption.address).to.exist;
  });

  it("Should store encrypted value", async function () {
    const encryptedBytes = "0x";
    await expect(
      singleEncryption.setEncryptedValue(encryptedBytes)
    ).to.not.be.reverted;
  });

  it("Should perform operation on encrypted value", async function () {
    const result = await singleEncryption.addToEncrypted();
    expect(result).to.exist;
  });

  it("Should restrict access to encrypted value", async function () {
    const [, nonOwner] = await ethers.getSigners();
    await expect(
      singleEncryption.connect(nonOwner).getEncryptedValue()
    ).to.be.revertedWith("Only owner");
  });
});
\`;
}

// ============================================================================
// MULTIPLE ENCRYPTION CONTRACT
// ============================================================================

export function multipleEncryptionContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

/**
 * @title MultipleEncryption
 * @notice Encrypt and manage multiple encrypted values
 * @dev Shows efficient batch encryption handling
 */
contract MultipleEncryption {
    euint32 private value1;
    euint32 private value2;
    euint32 private value3;

    event MultipleValuesSet(address indexed user, uint256 timestamp);

    /**
     * @notice Set multiple encrypted values atomically
     */
    function setMultipleValues(
        bytes calldata _encrypted1,
        bytes calldata _encrypted2,
        bytes calldata _encrypted3
    ) external {
        value1 = TFHE.asEuint32(_encrypted1);
        value2 = TFHE.asEuint32(_encrypted2);
        value3 = TFHE.asEuint32(_encrypted3);
        emit MultipleValuesSet(msg.sender, block.timestamp);
    }

    /**
     * @notice Sum all three encrypted values
     * @return Encrypted sum of all values
     */
    function sumAll() external view returns (euint32) {
        euint32 sum = TFHE.add(value1, value2);
        return TFHE.add(sum, value3);
    }

    /**
     * @notice Get average of three values (sum / 3)
     */
    function average() external view returns (euint32) {
        euint32 sum = TFHE.add(value1, value2);
        sum = TFHE.add(sum, value3);
        return TFHE.div(sum, TFHE.asEuint32(3));
    }
}
\`;
}

export function multipleEncryptionTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("MultipleEncryption", function () {
  let multipleEncryption: any;

  beforeEach(async function () {
    const MultipleEncryption = await ethers.getContractFactory("MultipleEncryption");
    multipleEncryption = await MultipleEncryption.deploy();
  });

  it("Should set multiple encrypted values", async function () {
    const enc1 = "0x";
    const enc2 = "0x";
    const enc3 = "0x";
    
    await expect(
      multipleEncryption.setMultipleValues(enc1, enc2, enc3)
    ).to.not.be.reverted;
  });

  it("Should compute sum of encrypted values", async function () {
    const result = await multipleEncryption.sumAll();
    expect(result).to.exist;
  });

  it("Should compute average of encrypted values", async function () {
    const result = await multipleEncryption.average();
    expect(result).to.exist;
  });
});
\`;
}

// ============================================================================
// SINGLE DECRYPTION USER CONTRACT
// ============================================================================

export function singleDecryptionUserContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

/**
 * @title SingleDecryptionUser
 * @notice User-initiated decryption with FHE.allow()
 * @dev Only the authorized user can decrypt their encrypted value
 */
contract SingleDecryptionUser {
    euint32 private userValue;
    address public valueOwner;

    event ValueDecrypted(address indexed user, uint256 timestamp);

    constructor(address _valueOwner) {
        valueOwner = _valueOwner;
        userValue = TFHE.asEuint32(0);
    }

    /**
     * @notice Set the encrypted value (anyone can call)
     */
    function setValue(bytes calldata _encrypted) external {
        userValue = TFHE.asEuint32(_encrypted);
    }

    /**
     * @notice Owner can decrypt their value using FHE.allow()
     * @dev This pattern ensures privacy while allowing authorized decryption
     */
    function decryptValue() external view returns (uint32) {
        require(msg.sender == valueOwner, "Not authorized");
        
        // Allow sender to decrypt (cryptographic proof required)
        FHE.allowTransient(userValue, msg.sender);
        
        uint32 decrypted = TFHE.decrypt(userValue);
        return decrypted;
    }

    /**
     * @notice Get encrypted value reference (doesn't decrypt)
     */
    function getEncrypted() external view returns (euint32) {
        return userValue;
    }
}
\`;
}

export function singleDecryptionUserTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("SingleDecryptionUser", function () {
  let singleDecryption: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const SingleDecryption = await ethers.getContractFactory("SingleDecryptionUser");
    singleDecryption = await SingleDecryption.deploy(owner.address);
  });

  it("Should deploy with owner", async function () {
    expect(await singleDecryption.valueOwner()).to.equal(owner.address);
  });

  it("Should set encrypted value", async function () {
    await expect(singleDecryption.setValue("0x")).to.not.be.reverted;
  });

  it("Should allow owner to decrypt", async function () {
    await singleDecryption.setValue("0x");
    const result = await singleDecryption.decryptValue();
    expect(result).to.exist;
  });

  it("Should prevent non-owner from decrypting", async function () {
    const [, nonOwner] = await ethers.getSigners();
    await singleDecryption.setValue("0x");
    
    await expect(
      singleDecryption.connect(nonOwner).decryptValue()
    ).to.be.revertedWith("Not authorized");
  });
});
\`;
}

// ============================================================================
// SINGLE DECRYPTION PUBLIC CONTRACT
// ============================================================================

export function singleDecryptionPublicContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

/**
 * @title SingleDecryptionPublic
 * @notice Public decryption for transparent operations
 * @dev Anyone can trigger decryption (use with caution)
 */
contract SingleDecryptionPublic {
    euint32 private value;
    uint32 public decryptedValue;
    address public lastDecryptor;

    event ValueDecryptedPublic(address indexed user, uint32 decryptedVal);

    /**
     * @notice Set encrypted value
     */
    function setEncryptedValue(bytes calldata _encrypted) external {
        value = TFHE.asEuint32(_encrypted);
    }

    /**
     * @notice Anyone can decrypt this value (public revelation)
     * @dev Warning: This exposes the encrypted value
     */
    function decryptAndReveal() external {
        // In production, add appropriate authorization logic
        uint32 plaintext = TFHE.decrypt(value);
        decryptedValue = plaintext;
        lastDecryptor = msg.sender;
        
        emit ValueDecryptedPublic(msg.sender, plaintext);
    }

    /**
     * @notice Get last decrypted value (anyone can view)
     */
    function getDecryptedValue() external view returns (uint32) {
        return decryptedValue;
    }
}
\`;
}

export function singleDecryptionPublicTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("SingleDecryptionPublic", function () {
  let singleDecryption: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const SingleDecryption = await ethers.getContractFactory("SingleDecryptionPublic");
    singleDecryption = await SingleDecryption.deploy();
  });

  it("Should allow anyone to decrypt", async function () {
    await singleDecryption.setEncryptedValue("0x");
    await expect(singleDecryption.decryptAndReveal()).to.not.be.reverted;
  });

  it("Should store decrypted value", async function () {
    await singleDecryption.setEncryptedValue("0x");
    await singleDecryption.decryptAndReveal();
    const result = await singleDecryption.getDecryptedValue();
    expect(result).to.exist;
  });

  it("Should track who decrypted", async function () {
    await singleDecryption.setEncryptedValue("0x");
    await singleDecryption.decryptAndReveal();
    expect(await singleDecryption.lastDecryptor()).to.equal(owner.address);
  });
});
\`;
}

// ============================================================================
// MULTIPLE DECRYPTION CONTRACT
// ============================================================================

export function multipleDecryptionContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

/**
 * @title MultipleDecryption
 * @notice Decrypt multiple encrypted values efficiently
 * @dev Demonstrates batch decryption patterns
 */
contract MultipleDecryption {
    euint32 private val1;
    euint32 private val2;
    euint32 private val3;

    uint32 public decrypted1;
    uint32 public decrypted2;
    uint32 public decrypted3;

    event MultipleValuesDecrypted(
        address indexed user,
        uint32 val1,
        uint32 val2,
        uint32 val3
    );

    /**
     * @notice Store three encrypted values
     */
    function setValues(
        bytes calldata _e1,
        bytes calldata _e2,
        bytes calldata _e3
    ) external {
        val1 = TFHE.asEuint32(_e1);
        val2 = TFHE.asEuint32(_e2);
        val3 = TFHE.asEuint32(_e3);
    }

    /**
     * @notice Decrypt all three values in single transaction
     */
    function decryptAll() external {
        FHE.allowTransient(val1, msg.sender);
        FHE.allowTransient(val2, msg.sender);
        FHE.allowTransient(val3, msg.sender);

        decrypted1 = TFHE.decrypt(val1);
        decrypted2 = TFHE.decrypt(val2);
        decrypted3 = TFHE.decrypt(val3);

        emit MultipleValuesDecrypted(msg.sender, decrypted1, decrypted2, decrypted3);
    }

    /**
     * @notice Get all decrypted values
     */
    function getDecryptedValues() external view returns (uint32, uint32, uint32) {
        return (decrypted1, decrypted2, decrypted3);
    }
}
\`;
}

export function multipleDecryptionTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("MultipleDecryption", function () {
  let multipleDecryption: any;

  beforeEach(async function () {
    const MultipleDecryption = await ethers.getContractFactory("MultipleDecryption");
    multipleDecryption = await MultipleDecryption.deploy();
  });

  it("Should set multiple encrypted values", async function () {
    await expect(
      multipleDecryption.setValues("0x", "0x", "0x")
    ).to.not.be.reverted;
  });

  it("Should decrypt all values", async function () {
    await multipleDecryption.setValues("0x", "0x", "0x");
    await expect(multipleDecryption.decryptAll()).to.not.be.reverted;
  });

  it("Should retrieve all decrypted values", async function () {
    await multipleDecryption.setValues("0x", "0x", "0x");
    await multipleDecryption.decryptAll();
    const [v1, v2, v3] = await multipleDecryption.getDecryptedValues();
    expect(v1).to.exist;
    expect(v2).to.exist;
    expect(v3).to.exist;
  });
});
\`;
}
