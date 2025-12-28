// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * Minimal shim of EIP712WithModifier for local compilation/testing only.
 * Provides a constructor and a `onlySignedPublicKey` modifier used by examples.
 */
abstract contract EIP712WithModifier {
    constructor(string memory /*name*/, string memory /*version*/) {}

    modifier onlySignedPublicKey(bytes calldata /*signature*/) {
        _;
    }
}
