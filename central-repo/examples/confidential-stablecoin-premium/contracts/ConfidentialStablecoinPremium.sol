// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * ConfidentialStablecoinPremium.sol
 *
 * Purpose: Illustrate a privacy-preserving stablecoin pattern where balances
 * are encrypted (`euint32`). Minting and redemption are controlled, and
 * actual peg maintenance / off-chain settlement is handled by a gateway.
 *
 * Notes:
 * - Balances are encrypted and stored in `encryptedBalances`.
 * - `redeemEncrypted` marks a redemption request; actual settlement must be
 *   performed off-chain after decryption/verification.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract ConfidentialStablecoinPremium {
    address public owner;

    mapping(address => euint32) private encryptedBalances;

    event EncryptedMint(address indexed to, euint32 amount);
    event EncryptedTransfer(address indexed from, address indexed to, euint32 amount);
    event EncryptedRedeemRequested(address indexed from, euint32 amount, address indexed recipient);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Owner mints encrypted amount into `to`'s encrypted balance
    function mintEncrypted(address to, euint32 amount) external onlyOwner {
        encryptedBalances[to] = TFHE.add(encryptedBalances[to], amount);
        emit EncryptedMint(to, amount);
    }

    /// Transfer encrypted amount between accounts (homomorphic ops)
    function transferEncrypted(address to, euint32 amount) external {
        address from = msg.sender;
        encryptedBalances[from] = TFHE.sub(encryptedBalances[from], amount);
        encryptedBalances[to] = TFHE.add(encryptedBalances[to], amount);
        emit EncryptedTransfer(from, to, amount);
    }

    /// Request redemption: caller requests an off-chain settlement to `recipient`.
    /// The contract records the request (encrypted amount) so an off-chain gateway
    /// can perform decryption, verification, and payout.
    function redeemEncrypted(euint32 amount, address recipient) external {
        address from = msg.sender;
        encryptedBalances[from] = TFHE.sub(encryptedBalances[from], amount);
        emit EncryptedRedeemRequested(from, amount, recipient);
    }

    /// View encrypted balance
    function encryptedBalanceOf(address who) external view returns (euint32) {
        return encryptedBalances[who];
    }
}
