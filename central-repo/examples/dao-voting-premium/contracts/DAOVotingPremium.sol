// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * DAOVotingPremium.sol
 *
 * Purpose: Demonstrate encrypted proposal creation and private voting
 * patterns. Votes are submitted as encrypted primitives (euint32). Tallying
 * and winner selection are performed off-chain by a gateway which then
 * finalizes the result on-chain by providing the encrypted tally and
 * declared winner address.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract DAOVotingPremium {
    address public owner;

    enum Phase { Open, Closed, Finalized }

    struct Proposal {
        address proposer;
        euint32 metadata; // encrypted proposal payload (e.g., description hash)
        euint32 encryptedYesTally;
        euint32 encryptedNoTally;
        Phase phase;
        address winner; // address chosen by gateway when finalizing
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    // track who voted for a proposal
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address indexed proposer);
    event VoteCast(uint256 indexed id, address indexed voter, euint32 encryptedYes);
    event VotingClosed(uint256 indexed id);
    event VotingFinalized(uint256 indexed id, address indexed winner, euint32 encryptedYesTally);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Create a new proposal with encrypted metadata
    function createProposal(euint32 metadata) external returns (uint256) {
        uint256 id = proposalCount++;
        proposals[id] = Proposal({
            proposer: msg.sender,
            metadata: metadata,
            encryptedYesTally: TFHE.asEuint32(0),
            encryptedNoTally: TFHE.asEuint32(0),
            phase: Phase.Open,
            winner: address(0),
            exists: true
        });
        emit ProposalCreated(id, msg.sender);
        return id;
    }

    /// Cast an encrypted vote: `encryptedYes` should be a ciphertext representing 1 for yes, 0 for no.
    /// Voters must provide the encrypted bit-of-vote computed client-side and signed by the gateway.
    function castVote(uint256 id, euint32 encryptedYes) external {
        require(proposals[id].exists, "no-proposal");
        require(proposals[id].phase == Phase.Open, "not-open");
        require(!hasVoted[id][msg.sender], "already-voted");

        // add the encryptedYes to the running yes tally; the caller is expected to
        // submit either an encrypted 1 or 0. For accountability the gateway should
        // validate signatures off-chain.
        proposals[id].encryptedYesTally = TFHE.add(proposals[id].encryptedYesTally, encryptedYes);
        // encryptedNoTally remains derivable off-chain (total - yes) if needed.

        hasVoted[id][msg.sender] = true;
        emit VoteCast(id, msg.sender, encryptedYes);
    }

    /// Close voting for a proposal (owner or governance module)
    function closeVoting(uint256 id) external onlyOwner {
        require(proposals[id].exists, "no-proposal");
        require(proposals[id].phase == Phase.Open, "wrong-phase");
        proposals[id].phase = Phase.Closed;
        emit VotingClosed(id);
    }

    /// Finalize a proposal: the gateway/off-chain process provides the encrypted
    /// yes tally and declares the winner address. This function records the
    /// result on-chain; cryptographic proofs should accompany this in production.
    function finalizeVoting(uint256 id, address chosenWinner, euint32 encryptedYesTally) external onlyOwner {
        require(proposals[id].exists, "no-proposal");
        require(proposals[id].phase == Phase.Closed, "not-closed");
        proposals[id].phase = Phase.Finalized;
        proposals[id].winner = chosenWinner;
        proposals[id].encryptedYesTally = encryptedYesTally;
        emit VotingFinalized(id, chosenWinner, encryptedYesTally);
    }
}
