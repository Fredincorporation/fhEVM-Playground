// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title SingleEncryptionPremium
 * @notice Demonstrates user-side encryption submission patterns and aggregated operations
 *
 * @dev Features:
 * - Users submit ciphertexts to the contract via `submitEncrypted`
 * - Contract stores per-user encrypted values
 * - Aggregation function `aggregate` homomorphically sums values for a set of addresses
 * - Limits to protect against expensive loops (`MAX_AGGREGATE = 20`)
 * - Anti-patterns and gas/security notes included
 */
contract SingleEncryptionPremium is EIP712WithModifier, Reencrypt {
    mapping(address => euint32) private encryptedValues;
    address[] private submitters;
    mapping(address => bool) private hasSubmitted;

    uint8 public constant MAX_AGGREGATE = 20;
    address private owner;

    event Submitted(address indexed submitter);
    event Aggregated(address indexed caller, uint256 count);
    event Cleared(address indexed caller);

    constructor() EIP712WithModifier("SingleEncryptionPremium", "1") {
        owner = msg.sender;
    }

    /**
     * @notice Submit an encrypted value (client encrypts value before sending)
     * @param value Encrypted value (euint32)
     * @dev If caller already submitted, this overwrites previous submission
     */
    function submitEncrypted(euint32 value) external {
        if (!hasSubmitted[msg.sender]) {
            submitters.push(msg.sender);
            hasSubmitted[msg.sender] = true;
        }
        encryptedValues[msg.sender] = value;
        emit Submitted(msg.sender);
    }

    /**
     * @notice Aggregate encrypted values for provided addresses
     * @param addrs Array of addresses to include in aggregation
     * @return sum Encrypted sum (euint32)
     * @dev Returns TFHE.add(... aggregated) for provided addresses
     * - Reverts if `addrs.length > MAX_AGGREGATE` to protect gas
     * - Empty list returns encrypted zero
     */
    function aggregate(address[] calldata addrs) public view returns (euint32 sum) {
        require(addrs.length <= MAX_AGGREGATE, "too-many-addrs");
        sum = TFHE.asEuint32(0);
        for (uint i = 0; i < addrs.length; i++) {
            address a = addrs[i];
            if (hasSubmitted[a]) {
                sum = TFHE.add(sum, encryptedValues[a]);
            }
        }
        // Note: view function - does not modify state
        return sum;
    }

    /**
     * @notice Convenience: aggregate all current submitters (bounded by MAX_AGGREGATE)
     */
    function aggregateAll() external view returns (euint32 sum) {
        require(submitters.length <= MAX_AGGREGATE, "submitters-too-many");
        euint32 result = TFHE.asEuint32(0);
        for (uint i = 0; i < submitters.length; i++) {
            address a = submitters[i];
            if (hasSubmitted[a]) {
                result = TFHE.add(result, encryptedValues[a]);
            }
        }
        return result;
    }

    /**
     * @notice Clear stored submissions (owner only)
     */
    function clearSubmissions() external {
        require(msg.sender == owner, "only-owner");
        for (uint i = 0; i < submitters.length; i++) {
            encryptedValues[submitters[i]] = TFHE.asEuint32(0);
            hasSubmitted[submitters[i]] = false;
        }
        delete submitters;
        emit Cleared(msg.sender);
    }

    // ---------------- Anti-patterns & Notes ----------------
    /**
     * @notice ❌ ANTI-PATTERN: Aggregating thousands of addresses on-chain
     * @dev Avoid loops over unbounded arrays. Limit batch sizes and perform off-chain aggregation when possible.
     */
    function antiPattern_unboundedAggregation(address[] calldata arr) external pure {
        // DO NOT use in production
        // For demonstration only
        if (arr.length > 1000) { revert(); }
    }

    function getSubmittersCount() external view returns (uint256) {
        return submitters.length;
    }

    function getEncryptedFor(address who) external view returns (euint32) {
        return encryptedValues[who];
    }

    function setOwner(address newOwner) external { require(msg.sender == owner, "only-owner"); owner = newOwner; }
}
