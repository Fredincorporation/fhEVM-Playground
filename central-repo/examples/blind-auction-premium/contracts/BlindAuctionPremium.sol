// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * BlindAuctionPremium.sol
 *
 * Purpose: Demonstrate a sealed-bid (blind) auction pattern with encrypted
 * bids stored on-chain. Bids remain encrypted (`euint32`) and the off-chain
 * gateway performs winner selection and provides an encrypted winning bid
 * along with the revealed winner address for on-chain settlement.
 *
 * Notes:
 * - This is an educational example. Real confidentiality requires careful
 *   gateway, replay protection, and signature validation.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract BlindAuctionPremium {
    address public owner;

    enum Phase { Auction, Closed, Finalized }
    Phase public phase;

    // bidder -> encrypted bid
    mapping(address => euint32) public encryptedBids;
    address[] public bidders;

    address public winner;
    euint32 public winningBid; // encrypted winning bid (provided at finalize)

    event BidSubmitted(address indexed bidder, euint32 encryptedBid);
    event AuctionClosed();
    event AuctionFinalized(address indexed winner, euint32 encryptedWinningBid);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        phase = Phase.Auction;
    }

    /// Submit an encrypted sealed bid during the Auction phase.
    function submitBid(euint32 encryptedBid) external {
        require(phase == Phase.Auction, "not-auction-phase");
        require(TFHE.isZero(encryptedBids[msg.sender]) ? true : false, "already-bid");
        encryptedBids[msg.sender] = encryptedBid;
        bidders.push(msg.sender);
        emit BidSubmitted(msg.sender, encryptedBid);
    }

    /// Close the bidding phase; off-chain gateway should compute the winner next.
    function closeBidding() external onlyOwner {
        require(phase == Phase.Auction, "wrong-phase");
        phase = Phase.Closed;
        emit AuctionClosed();
    }

    /// Finalize the auction by providing the winner address and encrypted winning bid.
    /// In production this should be accompanied by cryptographic proof or gateway
    /// signature verifying the selection.
    function finalizeAuction(address _winner, euint32 _winningBid) external onlyOwner {
        require(phase == Phase.Closed, "wrong-phase");
        winner = _winner;
        winningBid = _winningBid;
        phase = Phase.Finalized;
        emit AuctionFinalized(_winner, _winningBid);
    }

    /// Utility: return number of bidders
    function bidderCount() external view returns (uint256) {
        return bidders.length;
    }
}
