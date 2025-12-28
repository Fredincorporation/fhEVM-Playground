// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * Minimal shim for fhEVM gateway helpers used in test files and off-chain integration.
 * These are JavaScript/TypeScript functions in real fhEVM; placeholders here for Solidity import compatibility.
 * Real implementations would use the fhEVM gateway for encryption/decryption.
 */

// Note: These are typically JS/TS functions, not Solidity.
// This file is here to satisfy any Solidity imports that might reference them.
// Most gateway functions are called off-chain in test scripts via Node.js modules.

// Placeholder contract for completeness (rarely imported in Solidity)
contract GatewayHelpers {
    // Placeholder: Real gateway operations happen off-chain
    function initGateway() external pure {
        // Off-chain: initializes the fhEVM gateway
    }

    function getSignatureAndEncryption(uint256 data) external pure returns (bytes memory ciphertext, bytes memory signature) {
        // Off-chain: encrypts data and returns signature
        return (abi.encode(data), abi.encode(data));
    }

    function isMockedMode() external pure returns (bool) {
        // Off-chain: checks if gateway is in mocked mode (for testing)
        return true;
    }
}
