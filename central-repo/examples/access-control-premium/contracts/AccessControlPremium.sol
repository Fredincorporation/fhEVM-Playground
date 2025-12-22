// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title AccessControlPremium
 * @notice Demonstrates encrypted-role based access control using fhEVM patterns.
 *
 * @dev Features:
 * - Store encrypted roles per address
 * - Check encrypted permission using homomorphic comparisons
 * - Demonstrate `FHE.allow` pattern (skeleton) and transient allow
 * - Anti-patterns and gas/security notes
 */
contract AccessControlPremium is EIP712WithModifier, Reencrypt {
    // Encrypted role mapping. Example: role id encoded as euint8 inside euint32
    mapping(address => euint32) private encryptedRole;

    address private owner;

    event RoleAssigned(address indexed who);
    event RoleCleared(address indexed who);
    event PermissionChecked(address indexed who);
    event TransientAllowed(address indexed who);

    constructor() EIP712WithModifier("AccessControlPremium", "1") {
        owner = msg.sender;
    }

    /**
     * @notice Assign encrypted role to an address
     * @param who Address to assign
     * @param encRole Encrypted role value (e.g., 0=none,1=admin,2=moderator)
     * @dev No access control on assignment in this simple example (could be owner-only)
     */
    function assignEncryptedRole(address who, euint32 encRole) external {
        encryptedRole[who] = encRole;
        emit RoleAssigned(who);
    }

    /**
     * @notice Clear encrypted role for address
     */
    function clearRole(address who) external {
        encryptedRole[who] = TFHE.asEuint32(0);
        emit RoleCleared(who);
    }

    /**
     * @notice Check if `who` has at least `minRole` using homomorphic comparison
     * @param who Address to check
     * @param encMinRole Encrypted minimum role
     * @return ebool encrypted boolean indicating permission
     * @dev This returns an encrypted boolean; caller can decrypt if authorized
     */
    function hasRoleAtLeast(address who, euint32 encMinRole) external view returns (ebool) {
        euint32 encUserRole = encryptedRole[who];
        // TFHE.ge returns encrypted boolean for >= comparison
        return TFHE.ge(encUserRole, encMinRole);
    }

    /**
     * @notice Demonstrate transient allow pattern: owner grants decryption permission to grantee for a stored value
     * @param who grantee
     * @dev Real implementation would call: FHE.allowTransient(encryptedValue, who)
     */
    function allowTransient(address who) external {
        require(msg.sender == owner, "only-owner");
        // Emit event to indicate grant — actual gateway integration required off-chain
        emit TransientAllowed(who);
    }

    /**
     * @notice Anti-pattern: Decrypting roles on-chain for branching
     * @dev Demonstrates why decrypting for access checks is insecure and expensive
     */
    function antiPattern_decryptRole(address who) external {
        // uint32 role = TFHE.decrypt(encryptedRole[who]);
        // if (role >= 1) { /* grant */ }
        // Avoid doing this on-chain
    }

    function getEncryptedRole(address who) external view returns (euint32) {
        return encryptedRole[who];
    }

    function setOwner(address newOwner) external { require(msg.sender == owner, "only-owner"); owner = newOwner; }
}
