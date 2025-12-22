// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * AntiPatternsPremium.sol
 *
 * Purpose: Demonstrate common anti-patterns when working with encrypted
 * primitives on-chain and show safer alternatives. None of the "bad"
 * functions decrypt ciphertext on-chain — they only illustrate mistaken
 * design choices (public storage, events, unbounded loops, naive checks).
 *
 * Notes:
 * - Use an off-chain gateway for decryption and heavy computation.
 * - Avoid emitting raw ciphertext or storing it in public state.
 * - Limit loop sizes and use batching or off-chain aggregation.
 * - Prefer `msg.sender`-based access control (not `tx.origin`).
 */

import { TFHE, euint32, ebool } from "fhevm/lib/TFHE.sol";

contract AntiPatternsPremium {
    /// Emitted when insecurely storing raw ciphertext
    event InsecureStored(bytes ciphertext);

    /// Emitted when securely storing an encrypted value
    event SecureStored(address indexed setter, euint32 encryptedValue);

    /// Public storage that holds a raw ciphertext (anti-pattern)
    bytes public rawCiphertext;

    /// Encrypted value stored using encrypted primitive types (safer)
    euint32 public secureValue;

    /// Naive admin mapping that demonstrates a fragile check (anti-pattern)
    mapping(address => bool) public naiveAdmins;

    /// Proper admin mapping using explicit approvals
    mapping(address => bool) public admins;

    // -------------------------- Anti-Pattern Examples -----------------------

    /// @notice Insecure: stores raw ciphertext and emits it in an event.
    /// @dev Emitting/storing raw ciphertext may enable replay, correlation,
    ///      or leakage through off-chain indexers. Prefer storing encrypted
    ///      primitives and avoid emitting ciphertext in events.
    function insecureStore(bytes calldata ciphertext) external {
        rawCiphertext = ciphertext;
        emit InsecureStored(ciphertext);
    }

    /// @notice Safer: accept an encrypted primitive and store it without
    /// emitting raw ciphertext. The encrypted primitive type preserves the
    /// encrypted semantics and avoids leaking ciphertext to logs.
    function secureStoreEncrypted(euint32 encryptedValue) external {
        secureValue = encryptedValue;
        emit SecureStored(msg.sender, encryptedValue);
    }

    /// @notice Anti-pattern: unbounded loops over calldata-sized arrays.
    /// @dev This function is intentionally inefficient. Do not use for
    /// large arrays; prefer batching or off-chain aggregation.
    function insecureLoop(bytes[] calldata ciphers) external pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < ciphers.length; i++) {
            sum += ciphers[i].length;
        }
        return sum;
    }

    /// @notice Safer: aggregate using encrypted primitives (small arrays only)
    /// @dev Demonstrates on-chain homomorphic addition. Avoid large inputs.
    function safeAggregate(euint32[] calldata inputs) external view returns (euint32) {
        require(inputs.length > 0, "empty");
        euint32 acc = inputs[0];
        for (uint256 i = 1; i < inputs.length; i++) {
            acc = TFHE.add(acc, inputs[i]);
        }
        return acc;
    }

    /// @notice Anti-pattern: attempting to decrypt on-chain (placeholder)
    /// @dev Decryption must happen off-chain in a gateway with secret keys.
    ///      This function purposely reverts to discourage the pattern.
    function decryptOnChain(bytes calldata) external pure returns (uint256) {
        revert("Do not decrypt on-chain; use an off-chain gateway");
    }

    /// @notice Demonstrates a naive access-control check using `tx.origin`.
    /// @dev Using `tx.origin` creates phishing risks via intermediary contracts.
    function setNaiveAdmin(address who) external {
        require(tx.origin == msg.sender, "naive check failed");
        naiveAdmins[who] = true;
    }

    /// @notice Safer: explicit admin grants via msg.sender-authorized call
    function grantAdmin(address who) external {
        require(admins[msg.sender], "caller-not-admin");
        admins[who] = true;
    }

    /// --------------------------- Helper/Docs -------------------------------

    /// @notice Convenience helper to demonstrate an encrypted comparison.
    function isSecureValueGreaterThan(euint32 other) external view returns (ebool) {
        return TFHE.gt(secureValue, other);
    }
}
