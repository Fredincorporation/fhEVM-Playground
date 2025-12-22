// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title ArithmeticPremium
 * @notice Premium example demonstrating homomorphic arithmetic on encrypted integers.
 *
 * @dev Features:
 * - Addition, subtraction, multiplication, and safe multiplication by small constants
 * - Edge-case handling and anti-pattern examples
 * - Gas and security notes
 * - Events for auditability
 *
 * Gas notes (approx):
 * - TFHE.add(euint32, euint32): ~45k
 * - TFHE.sub(euint32, euint32): ~45k
 * - TFHE.mul(euint32, euint32): ~90k (more expensive)
 */
contract ArithmeticPremium is EIP712WithModifier, Reencrypt {
    // Encrypted storage (euint32)
    euint32 private encryptedA;
    euint32 private encryptedB;

    address private owner;

    event ASet(address indexed setter);
    event BSet(address indexed setter);
    event Added(address indexed caller);
    event Subtracted(address indexed caller);
    event Multiplied(address indexed caller);

    constructor() EIP712WithModifier("ArithmeticPremium", "1") {
        owner = msg.sender;
        encryptedA = TFHE.asEuint32(0);
        encryptedB = TFHE.asEuint32(0);
    }

    // ------------------------- Write Operations ------------------------------

    /**
     * @notice Set encrypted operand A
     * @param a Encrypted value for A
     */
    function setA(euint32 a) external {
        encryptedA = a;
        emit ASet(msg.sender);
    }

    /**
     * @notice Set encrypted operand B
     * @param b Encrypted value for B
     */
    function setB(euint32 b) external {
        encryptedB = b;
        emit BSet(msg.sender);
    }

    /**
     * @notice Encrypted addition: A + B
     * @dev Returns new encrypted A (A becomes A+B)
     */
    function addAB() external {
        encryptedA = TFHE.add(encryptedA, encryptedB);
        emit Added(msg.sender);
    }

    /**
     * @notice Encrypted subtraction: A - B
     * @dev Underflow wraps as uint32 behavior; caller must consider bounds
     */
    function subAB() external {
        encryptedA = TFHE.sub(encryptedA, encryptedB);
        emit Subtracted(msg.sender);
    }

    /**
     * @notice Encrypted multiplication: A * B
     * @dev Multiplication is more expensive. Avoid large multiplicands to save gas.
     */
    function mulAB() external {
        encryptedA = TFHE.mul(encryptedA, encryptedB);
        emit Multiplied(msg.sender);
    }

    /**
     * @notice Multiply A by a small plaintext constant
     * @param factor Plaintext uint32 factor (small to avoid high cost)
     * @dev Demonstrates cheaper pattern: multiply by constant via repeated addition
     */
    function mulAByConstant(uint32 factor) external {
        require(factor <= 256, "factor-too-large");
        // Efficient approach: repeated doubling (exponentiation by squaring) could be done off-chain
        // Here we show safe repeated addition for small factors
        euint32 acc = TFHE.asEuint32(0);
        for (uint i = 0; i < factor; i++) {
            acc = TFHE.add(acc, encryptedA);
        }
        encryptedA = acc;
        emit Multiplied(msg.sender);
    }

    // ------------------------- Read Operations -------------------------------

    function getA() external view returns (euint32) {
        return encryptedA;
    }

    function getB() external view returns (euint32) {
        return encryptedB;
    }

    // ------------------------- Anti-patterns --------------------------------

    /**
     * @notice ❌ ANTI-PATTERN: Decrypt then compute on-chain
     * @dev Shows how NOT to do arithmetic; expensive and leaks data
     */
    function antiPattern_decryptThenCompute(uint32 plain) external {
        // uint32 a = TFHE.decrypt(encryptedA);
        // uint32 b = plain;
        // uint32 res = a + b;
        // encryptedA = TFHE.asEuint32(res);
        // ❗ Avoid: expensive decryption + reveals
    }

    /**
     * @notice ❌ ANTI-PATTERN: Multiplying large encrypted values
     * @dev Multiplication is expensive and can produce large intermediate values; avoid if possible
     */
    function antiPattern_heavyMultiply() external {
        // encryptedA = TFHE.mul(encryptedA, encryptedA); // expensive
    }

    // ------------------------- Utility / Owner Helpers ----------------------

    function setOwner(address newOwner) external {
        require(msg.sender == owner, "only-owner");
        owner = newOwner;
    }
}
