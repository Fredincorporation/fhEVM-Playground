// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * VestingPremium.sol
 *
 * Purpose: Demonstrate encrypted vesting schedules where amounts remain
 * encrypted on-chain. The contract records vest entries mapping to an
 * encrypted amount and a release timestamp. Claim releases are recorded
 * on-chain while decryption is performed off-chain by the gateway.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract VestingPremium {
    struct Vest {
        address beneficiary;
        euint32 amount; // encrypted vested amount
        uint64 releaseAt; // unix timestamp
        bool claimed;
    }

    uint256 public vestCount;
    mapping(uint256 => Vest) public vests;

    event VestCreated(uint256 indexed id, address indexed beneficiary, uint64 releaseAt);
    event VestClaimed(uint256 indexed id, address indexed beneficiary);

    /// Create a vesting entry with encrypted amount and release time
    function createVest(address beneficiary, euint32 amount, uint64 releaseAt) external returns (uint256) {
        require(beneficiary != address(0), "zero-beneficiary");
        require(releaseAt > block.timestamp, "release-in-past");

        uint256 id = vestCount++;
        vests[id] = Vest({
            beneficiary: beneficiary,
            amount: amount,
            releaseAt: releaseAt,
            claimed: false
        });

        emit VestCreated(id, beneficiary, releaseAt);
        return id;
    }

    /// Claim a vesting entry once release time passed.
    /// This marks the vest as claimed. Actual transfer of plaintext tokens
    /// must be performed off-chain by the holder/gateway after decryption.
    function claimVest(uint256 id) external {
        Vest storage v = vests[id];
        require(!v.claimed, "already-claimed");
        require(block.timestamp >= v.releaseAt, "not-released");
        require(v.beneficiary == msg.sender, "not-beneficiary");

        v.claimed = true;
        emit VestClaimed(id, msg.sender);
    }

    /// View vest info (amount remains encrypted)
    function vestInfo(uint256 id) external view returns (address, euint32, uint64, bool) {
        Vest storage v = vests[id];
        return (v.beneficiary, v.amount, v.releaseAt, v.claimed);
    }
}
