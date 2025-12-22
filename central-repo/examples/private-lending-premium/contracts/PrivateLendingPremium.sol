// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * PrivateLendingPremium.sol
 *
 * Purpose: Demonstrate confidential loan offers and encrypted collateral
 * accounting. Loan principals and collateral are stored as encrypted
 * primitives (`euint32`). Off-chain gateway is responsible for verification
 * of amounts, repayments, and solvency when necessary.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract PrivateLendingPremium {
    address public owner;

    struct LoanOffer {
        address lender;
        address borrower;
        euint32 principal;   // encrypted principal amount
        euint32 collateral;  // encrypted collateral amount
        uint64 duration;     // seconds
        uint64 startAt;      // start timestamp when accepted
        bool active;
        bool repaid;
        bool exists;
    }

    uint256 public offerCount;
    mapping(uint256 => LoanOffer) public offers;

    event LoanOfferCreated(uint256 indexed id, address indexed lender);
    event LoanAccepted(uint256 indexed id, address indexed borrower, uint64 startAt);
    event LoanRepaid(uint256 indexed id, address indexed borrower);
    event LoanLiquidated(uint256 indexed id, address indexed lender);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Create a loan offer (lender-side) with encrypted principal and collateral
    function createOffer(euint32 principal, euint32 collateral, uint64 duration) external returns (uint256) {
        require(duration > 0, "invalid-duration");
        uint256 id = offerCount++;
        offers[id] = LoanOffer({
            lender: msg.sender,
            borrower: address(0),
            principal: principal,
            collateral: collateral,
            duration: duration,
            startAt: 0,
            active: false,
            repaid: false,
            exists: true
        });
        emit LoanOfferCreated(id, msg.sender);
        return id;
    }

    /// Borrower accepts the offer; contract records borrower and start time.
    function acceptOffer(uint256 id) external {
        LoanOffer storage o = offers[id];
        require(o.exists, "no-offer");
        require(o.borrower == address(0), "already-accepted");
        o.borrower = msg.sender;
        o.startAt = uint64(block.timestamp);
        o.active = true;
        emit LoanAccepted(id, msg.sender, o.startAt);
    }

    /// Borrower repays the loan (off-chain verification recommended)
    function repayLoan(uint256 id, euint32 repayEncrypted) external {
        LoanOffer storage o = offers[id];
        require(o.exists, "no-offer");
        require(o.active, "not-active");
        require(o.borrower == msg.sender, "not-borrower");
        // In production, gateway verifies repayment covers principal+interest.
        o.repaid = true;
        o.active = false;
        emit LoanRepaid(id, msg.sender);
    }

    /// Lender can liquidate if duration passed and loan not repaid.
    function liquidate(uint256 id) external {
        LoanOffer storage o = offers[id];
        require(o.exists, "no-offer");
        require(o.lender == msg.sender, "not-lender");
        require(o.active, "not-active");
        require(uint64(block.timestamp) >= o.startAt + o.duration, "not-matured");
        // Off-chain gateway would provide evidence; here we just mark liquidation.
        o.active = false;
        emit LoanLiquidated(id, msg.sender);
    }

    /// Helper to inspect an offer (amounts remain encrypted)
    function offerInfo(uint256 id) external view returns (address, address, euint32, euint32, uint64, uint64, bool, bool) {
        LoanOffer storage o = offers[id];
        return (o.lender, o.borrower, o.principal, o.collateral, o.duration, o.startAt, o.active, o.repaid);
    }
}
