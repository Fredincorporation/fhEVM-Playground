// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title PublicEncryptionPremium
 * @notice Demonstrates contract-level encryption and controlled public decryption patterns.
 *
 * @dev Patterns included:
 * - Store encrypted values on-chain
 * - Public decryption flow for transparent outputs (use sparingly)
 * - Re-encryption / allowTransient patterns for temporary access
 * - Gas and security notes
 *
 * Security: Public decryption reveals plaintext; use only when required by protocol.
 */
contract PublicEncryptionPremium is EIP712WithModifier, Reencrypt {
    mapping(uint256 => euint32) private storageMap;
    uint256 private counter;
    address private owner;

    event Stored(uint256 indexed id, address indexed who);
    event PubliclyDecrypted(uint256 indexed id, address indexed who);
    event ReencryptionAllowed(uint256 indexed id, address indexed who);

    constructor() EIP712WithModifier("PublicEncryptionPremium", "1") {
        owner = msg.sender;
        counter = 0;
    }

    /**
     * @notice Store encrypted value on-chain and returns id
     * @param value Encrypted value
     * @return id Identifier for stored ciphertext
     */
    function storeEncrypted(euint32 value) external returns (uint256 id) {
        id = ++counter;
        storageMap[id] = value;
        emit Stored(id, msg.sender);
        return id;
    }

    /**
     * @notice Publicly decrypt and return a value (for transparency)
     * @dev WARNING: This reveals plaintext to everyone. Use for public outputs only.
     * In this example we simulate public decryption by returning a placeholder uint32.
     * Real-world decryption would require gateway involvement and signing.
     */
    function publicDecrypt(uint256 id) external returns (uint32) {
        // Placeholder implementation: in real fhEVM, public decryption is handled by the gateway
        // and the contract would use FHE.allow or similar to signal intent.
        // Here we emit an event and return 0 as a stub.
        require(id > 0 && id <= counter, "invalid-id");
        emit PubliclyDecrypted(id, msg.sender);
        return 0; // Placeholder - do not implement real decryption on-chain
    }

    /**
     * @notice Allow transient re-encryption for an address (owner only)
     * @dev Demonstrates pattern: grant short-lived permission to decrypt
     */
    function allowReencryption(uint256 id, address grantee) external {
        require(msg.sender == owner, "only-owner");
        require(id > 0 && id <= counter, "invalid-id");
        // In an actual fhEVM integration: FHE.allowTransient(storageMap[id], grantee);
        emit ReencryptionAllowed(id, grantee);
    }

    function getStored(uint256 id) external view returns (euint32) {
        require(id > 0 && id <= counter, "invalid-id");
        return storageMap[id];
    }

    function setOwner(address newOwner) external { require(msg.sender == owner, "only-owner"); owner = newOwner; }
}
