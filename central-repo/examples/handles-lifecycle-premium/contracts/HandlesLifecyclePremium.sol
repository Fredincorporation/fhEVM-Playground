// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * HandlesLifecyclePremium.sol
 *
 * Purpose: Demonstrate encrypted handle creation, persistence, expiry,
 * and safe lifecycle transitions. The contract stores handles (opaque ids)
 * mapped to encrypted metadata values. Expiry and transfers are controlled
 * on-chain while decryption of metadata remains off-chain.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract HandlesLifecyclePremium {
    struct Handle {
        address owner;
        euint32 metadata; // encrypted metadata (e.g., pointer, quota)
        uint64 expiresAt; // unix timestamp; 0 means never
        bool exists;
    }

    mapping(bytes32 => Handle) private handles;

    event HandleCreated(bytes32 indexed handleId, address indexed owner, uint64 expiresAt);
    event HandleTransferred(bytes32 indexed handleId, address indexed from, address indexed to);
    event HandleExpired(bytes32 indexed handleId);

    /// Create a handle with encrypted metadata and optional ttl (seconds)
    function createHandle(euint32 metadata, uint64 ttlSeconds) external returns (bytes32) {
        bytes32 handleId = keccak256(abi.encodePacked(msg.sender, metadata, block.timestamp));
        require(!handles[handleId].exists, "handle-exists");

        uint64 expiry = 0;
        if (ttlSeconds > 0) {
            expiry = uint64(block.timestamp) + ttlSeconds;
        }

        handles[handleId] = Handle({
            owner: msg.sender,
            metadata: metadata,
            expiresAt: expiry,
            exists: true
        });

        emit HandleCreated(handleId, msg.sender, expiry);
        return handleId;
    }

    /// Transfer a handle to another owner (only current owner)
    function transferHandle(bytes32 handleId, address to) external {
        Handle storage h = handles[handleId];
        require(h.exists, "no-handle");
        require(h.owner == msg.sender, "not-owner");
        require(!isExpired(handleId), "expired");

        address from = h.owner;
        h.owner = to;
        emit HandleTransferred(handleId, from, to);
    }

    /// Expire a handle immediately (owner-only) — demonstrates lifecycle
    function expireHandle(bytes32 handleId) external {
        Handle storage h = handles[handleId];
        require(h.exists, "no-handle");
        require(h.owner == msg.sender, "not-owner");
        h.expiresAt = uint64(block.timestamp);
        emit HandleExpired(handleId);
    }

    /// Internal helper to check expiry
    function isExpired(bytes32 handleId) public view returns (bool) {
        Handle storage h = handles[handleId];
        if (!h.exists) return true;
        if (h.expiresAt == 0) return false;
        return uint64(block.timestamp) >= h.expiresAt;
    }

    /// View owner (zero address if expired or non-existent)
    function ownerOf(bytes32 handleId) external view returns (address) {
        if (isExpired(handleId)) return address(0);
        return handles[handleId].owner;
    }

    /// View encrypted metadata (callers may receive encrypted payload)
    function metadataOf(bytes32 handleId) external view returns (euint32) {
        require(!isExpired(handleId), "expired");
        return handles[handleId].metadata;
    }

    /// Batch expire handles that are past their expiry timestamp (gas-bounded)
    /// Caller should supply handles to check; this avoids an unbounded sweep.
    function expireBatch(bytes32[] calldata ids) external {
        for (uint256 i = 0; i < ids.length; i++) {
            bytes32 id = ids[i];
            if (handles[id].exists && handles[id].expiresAt != 0 && uint64(block.timestamp) >= handles[id].expiresAt) {
                handles[id].expiresAt = uint64(block.timestamp);
                emit HandleExpired(id);
            }
        }
    }
}
