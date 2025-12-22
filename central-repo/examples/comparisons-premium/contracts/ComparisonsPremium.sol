// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title ComparisonsPremium
 * @notice Premium comparison patterns for encrypted values (gt, lt, eq, select)
 *
 * @dev This contract demonstrates:
 * - Homomorphic comparisons producing `ebool`
 * - Using `TFHE.select` to branch without decryption
 * - Anti-patterns and gas notes
 */
contract ComparisonsPremium is EIP712WithModifier, Reencrypt {
    euint32 private a;
    euint32 private b;

    address private owner;

    event ASet(address indexed setter);
    event BSet(address indexed setter);
    event Compared(address indexed caller);

    constructor() EIP712WithModifier("ComparisonsPremium", "1") {
        owner = msg.sender;
        a = TFHE.asEuint32(0);
        b = TFHE.asEuint32(0);
    }

    // ------------------ Setters ------------------
    function setA(euint32 _a) external {
        a = _a;
        emit ASet(msg.sender);
    }

    function setB(euint32 _b) external {
        b = _b;
        emit BSet(msg.sender);
    }

    // ------------------ Comparisons ------------------

    /**
     * @notice Returns encrypted boolean if A > B
     * @return ebool encrypted boolean
     */
    function isAGreaterThanB() external view returns (ebool) {
        return TFHE.gt(a, b);
    }

    /**
     * @notice Returns encrypted boolean if A < B
     */
    function isALessThanB() external view returns (ebool) {
        return TFHE.lt(a, b);
    }

    /**
     * @notice Returns encrypted boolean if A == B
     */
    function isAEqualB() external view returns (ebool) {
        return TFHE.eq(a, b);
    }

    /**
     * @notice Select between two encrypted values based on encrypted boolean
     * @param threshold Encrypted threshold to compare with `a`
     * @dev Demonstrates TFHE.select(trueVal, falseVal)
     */
    function selectBasedOnThreshold(euint32 threshold) external {
        ebool cond = TFHE.gt(a, threshold);
        // If cond => choose a + b, else choose a
        euint32 choice1 = TFHE.add(a, b);
        euint32 choice2 = a;
        euint32 selected = TFHE.select(cond, choice1, choice2);
        // store selected into a
        a = selected;
        emit Compared(msg.sender);
    }

    // ------------------ Anti-patterns ------------------
    /**
     * @notice ❌ ANTI-PATTERN: Decrypt for branching
     * @dev Decrypting to perform if/else is expensive and leaks information
     */
    function antiPattern_decryptBranch() external {
        // uint32 val = TFHE.decrypt(a);
        // if (val > 10) { ... }
        // Avoid this - use homomorphic comparisons
    }

    // ------------------ Utilities ------------------
    function getA() external view returns (euint32) { return a; }
    function getB() external view returns (euint32) { return b; }

    function setOwner(address newOwner) external { require(msg.sender == owner, "only-owner"); owner = newOwner; }
}
