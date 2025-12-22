// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title InputProofsPremium
 * @notice Demonstrates how to verify encrypted inputs meet constraints without revealing them.
 *
 * @dev Features:
 * - Homomorphic checks for range constraints (min <= value < max)
 * - Combination of boolean checks using TFHE.and / TFHE.or
 * - Example patterns for threshold checks and composite constraints
 * - Anti-patterns for inefficient verification (decrypt-first)
 * - Gas and security notes
 */
contract InputProofsPremium is EIP712WithModifier, Reencrypt {
    constructor() EIP712WithModifier("InputProofsPremium", "1") {}

    mapping(address => euint32) public submitted;

    event Submitted(address indexed who);
    event Verified(address indexed who, bool success);

    /**
     * @notice Submit encrypted input for later verification
     */
    function submit(euint32 encValue) external {
        submitted[msg.sender] = encValue;
        emit Submitted(msg.sender);
    }

    /**
     * @notice Verify a submitted value lies within [min, max)
     * @param who Address of submitter
     * @param encMin Encrypted minimum (inclusive)
     * @param encMax Encrypted maximum (exclusive)
     * @return ebool Encrypted boolean result of (min <= value && value < max)
     *
     * Pattern:
     *  - TFHE.ge(value, min) -> ebool a
     *  - TFHE.lt(value, max) -> ebool b
     *  - TFHE.and(a, b) -> ebool result
     */
    function verifyRange(address who, euint32 encMin, euint32 encMax) external view returns (ebool) {
        euint32 val = submitted[who];
        ebool atLeast = TFHE.ge(val, encMin);
        ebool lessThan = TFHE.lt(val, encMax);
        ebool result = TFHE.and(atLeast, lessThan);
        return result;
    }

    /**
     * @notice Verify multiple constraints combined (example composite check)
     * @dev Demonstrates combining more than two ebooleans safely
     */
    function verifyComposite(address who, euint32 encMin, euint32 encMax, euint32 encOtherThreshold) external view returns (ebool) {
        euint32 val = submitted[who];
        ebool inRange = TFHE.and(TFHE.ge(val, encMin), TFHE.lt(val, encMax));
        ebool aboveOther = TFHE.gt(val, encOtherThreshold);
        // final = inRange AND aboveOther
        ebool finalRes = TFHE.and(inRange, aboveOther);
        return finalRes;
    }

    /**
     * @notice Anti-pattern: decrypt first and check on-chain
     * @dev Decrypting exposes data and is expensive; avoid in production
     */
    function antiPattern_decryptAndCheck(address who, uint32 min, uint32 max) external pure {
        // uint32 val = TFHE.decrypt(submitted[who]);
        // require(val >= min && val < max, "out-of-range");
        // Expensive and leaks data
    }

    /**
     * @notice Helper: get submitted ciphertext for address
     */
    function getSubmitted(address who) external view returns (euint32) {
        return submitted[who];
    }
}
