// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Minimal shim for fhevm TFHE types and functions so examples compile locally.
// This provides simple, insecure wrappers that mimic the real fhEVM API surface
// enough for compilation and simple unit testing (no cryptographic security).

type euint32 is uint32;
type ebool is bool;

library TFHE {
    function asEuint32(uint32 x) internal pure returns (euint32) {
        return euint32.wrap(x);
    }

    function add(euint32 a, euint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) + euint32.unwrap(b));
        }
    }

    function add(euint32 a, uint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) + b);
        }
    }

    function add(uint32 a, euint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(a + euint32.unwrap(b));
        }
    }

    function sub(euint32 a, euint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) - euint32.unwrap(b));
        }
    }

    function sub(euint32 a, uint32 b) internal pure returns (euint32) {
        unchecked {
            return euint32.wrap(euint32.unwrap(a) - b);
        }
    }

    function mul(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) * euint32.unwrap(b));
    }

    function mul(euint32 a, uint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) * b);
    }

    function gt(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) > euint32.unwrap(b));
    }

    function ge(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) >= euint32.unwrap(b));
    }

    function lt(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) < euint32.unwrap(b));
    }

    function le(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) <= euint32.unwrap(b));
    }

    function eq(euint32 a, euint32 b) internal pure returns (ebool) {
        return ebool.wrap(euint32.unwrap(a) == euint32.unwrap(b));
    }

    function and(ebool a, ebool b) internal pure returns (ebool) {
        return ebool.wrap(ebool.unwrap(a) && ebool.unwrap(b));
    }

    function or(ebool a, ebool b) internal pure returns (ebool) {
        return ebool.wrap(ebool.unwrap(a) || ebool.unwrap(b));
    }

    // Helper for tests: treat encrypted zero as plaintext zero (not secure)
    function isZero(euint32 a) internal pure returns (bool) {
        return euint32.unwrap(a) == 0;
    }

    function select(ebool cond, euint32 a, euint32 b) internal pure returns (euint32) {
        return ebool.unwrap(cond) ? a : b;
    }

    // In the real fhEVM this would require gateway permissions; here we unwrap.
    function decrypt(euint32 a) internal pure returns (uint32) {
        return euint32.unwrap(a);
    }
}
    // No-op seal for example shim: the real fhEVM provides `FHE.sealOutput`
    // which marks view outputs as sealed for the gateway. Here we expose
    // a same-surface helper so examples can call it without needing the
    // real runtime. This is a compile-time no-op.
    function sealOutput(euint32 a) internal pure returns (euint32) {
        return a;
    }
