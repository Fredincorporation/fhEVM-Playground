// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * ERC7984Premium.sol
 *
 * Purpose: Illustrate a modular private-token pattern (inspired by an
 * imaginary `ERC7984` privacy-focused extension). Balances and allowances
 * are kept encrypted (`euint32`). Modules can be registered to act as
 * minters. Approvals and transferFrom use encrypted allowances updated
 * homomorphically.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract ERC7984Premium {
    address public owner;

    mapping(address => euint32) private encryptedBalances;
    mapping(address => mapping(address => euint32)) private encryptedAllowances; // owner => spender => enc allowance
    mapping(address => bool) public modules; // modules authorized to mint

    event ModuleRegistered(address indexed module);
    event EncryptedMintByModule(address indexed module, address indexed to, euint32 amount);
    event EncryptedApproval(address indexed owner, address indexed spender, euint32 amount);
    event EncryptedTransferFrom(address indexed spender, address indexed from, address indexed to, euint32 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    modifier onlyModule() {
        require(modules[msg.sender], "not-module");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Owner registers a module that can mint on behalf of users.
    function registerModule(address module) external onlyOwner {
        modules[module] = true;
        emit ModuleRegistered(module);
    }

    /// Modules mint encrypted amounts to a recipient (homomorphic add)
    function mintByModule(address to, euint32 amount) external onlyModule {
        encryptedBalances[to] = TFHE.add(encryptedBalances[to], amount);
        emit EncryptedMintByModule(msg.sender, to, amount);
    }

    /// User approves a spender with an encrypted allowance
    function approveEncrypted(address spender, euint32 amount) external {
        address ownerAddr = msg.sender;
        encryptedAllowances[ownerAddr][spender] = amount;
        emit EncryptedApproval(ownerAddr, spender, amount);
    }

    /// Spender transfers from owner to `to` using encrypted allowance subtraction
    function transferFromEncrypted(address from, address to, euint32 amount) external {
        address spender = msg.sender;
        // subtract allowance homomorphically
        encryptedAllowances[from][spender] = TFHE.sub(encryptedAllowances[from][spender], amount);
        // subtract from sender balance, add to recipient
        encryptedBalances[from] = TFHE.sub(encryptedBalances[from], amount);
        encryptedBalances[to] = TFHE.add(encryptedBalances[to], amount);
        emit EncryptedTransferFrom(spender, from, to, amount);
    }

    function encryptedBalanceOf(address who) external view returns (euint32) {
        return encryptedBalances[who];
    }

    function encryptedAllowanceOf(address ownerAddr, address spender) external view returns (euint32) {
        return encryptedAllowances[ownerAddr][spender];
    }
}
