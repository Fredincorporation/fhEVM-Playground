// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * PrivateERC20Premium.sol
 *
 * Purpose: Demonstrate a pattern for an ERC-20-like token that keeps
 * balances encrypted on-chain using fhEVM encrypted primitives. This is
 * a wrapper demonstration — it does not implement the standard ERC-20
 * plaintext interfaces because balances remain encrypted and private.
 *
 * Design notes:
 * - Balances are `euint32` encrypted primitives.
 * - Transfers operate on ciphertexts using homomorphic add/sub operations.
 * - Minting/burning must be owner-controlled (illustrative).
 * - Events emit only opaque encrypted primitives (avoid revealing plaintext).
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract PrivateERC20Premium {
    address public owner;

    // encrypted balances per address
    mapping(address => euint32) private encryptedBalances;

    event EncryptedMint(address indexed to, euint32 amount);
    event EncryptedTransfer(address indexed from, address indexed to, euint32 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Owner-only: mint an encrypted amount into `to`'s encrypted balance.
    function mintEncrypted(address to, euint32 amount) external onlyOwner {
        encryptedBalances[to] = TFHE.add(encryptedBalances[to], amount);
        emit EncryptedMint(to, amount);
    }

    /// @notice Transfer an encrypted amount from caller to `to`.
    /// @dev This uses TFHE.sub to consume sender ciphertext and TFHE.add for recipient.
    function transferEncrypted(address to, euint32 amount) external {
        address from = msg.sender;
        encryptedBalances[from] = TFHE.sub(encryptedBalances[from], amount);
        encryptedBalances[to] = TFHE.add(encryptedBalances[to], amount);
        emit EncryptedTransfer(from, to, amount);
    }

    /// @notice View the encrypted balance for `who`.
    function encryptedBalanceOf(address who) external view returns (euint32) {
        return encryptedBalances[who];
    }

    /// @notice (Anti-pattern) Reveal plaintext balance on-chain — intentionally omitted.
    /// @dev Plaintext balance queries would defeat the privacy goal. Decrypt off-chain.
}
