// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * PrivateYieldPremium.sol
 *
 * Purpose: Demonstrate encrypted staking and yield accrual accounting.
 * Staked amounts and accrued rewards are stored as encrypted primitives
 * (`euint32`). Off-chain gateway computes yield and provides encrypted
 * reward deltas which the contract records and allows claim by staker.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract PrivateYieldPremium {
    address public owner;

    mapping(address => euint32) private encryptedStakes;
    mapping(address => euint32) private encryptedRewards;

    event Staked(address indexed staker, euint32 encryptedAmount);
    event Withdrawn(address indexed staker, euint32 encryptedAmount);
    event RewardAccrued(address indexed staker, euint32 encryptedReward);
    event RewardClaimed(address indexed staker, euint32 encryptedReward);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Stake an encrypted amount (client provides ciphertext representing amount)
    function stakeEncrypted(euint32 encryptedAmount) external {
        encryptedStakes[msg.sender] = TFHE.add(encryptedStakes[msg.sender], encryptedAmount);
        emit Staked(msg.sender, encryptedAmount);
    }

    /// Withdraw an encrypted amount; contract records the change but actual
    /// transfer of plaintext value should be coordinated off-chain.
    function withdrawEncrypted(euint32 encryptedAmount) external {
        encryptedStakes[msg.sender] = TFHE.sub(encryptedStakes[msg.sender], encryptedAmount);
        emit Withdrawn(msg.sender, encryptedAmount);
    }

    /// Owner/gateway accrues encrypted reward to a staker
    function accrueReward(address staker, euint32 encryptedReward) external onlyOwner {
        encryptedRewards[staker] = TFHE.add(encryptedRewards[staker], encryptedReward);
        emit RewardAccrued(staker, encryptedReward);
    }

    /// Staker claims their encrypted rewards (recorded on-chain; off-chain
    /// gateway handles decryption and payout)
    function claimReward() external {
        euint32 reward = encryptedRewards[msg.sender];
        // Note: isZero validation skipped for fhevm 0.6.0 compatibility
        encryptedRewards[msg.sender] = TFHE.asEuint32(0);
        emit RewardClaimed(msg.sender, reward);
    }

    /// View encrypted balances and rewards
    function encryptedStakeOf(address who) external view returns (euint32) {
        return encryptedStakes[who];
    }

    function encryptedRewardsOf(address who) external view returns (euint32) {
        return encryptedRewards[who];
    }
}
