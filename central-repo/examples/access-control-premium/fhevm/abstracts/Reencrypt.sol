// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * Minimal shim for Reencrypt used as a base contract in examples.
 * Provides a placeholder `reencrypt` helper for compilation only.
 */
abstract contract Reencrypt {
    function reencrypt(bytes memory data) internal pure returns (bytes memory) {
        return data;
    }
}
