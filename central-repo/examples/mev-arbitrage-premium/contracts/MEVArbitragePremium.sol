// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * MEVArbitragePremium.sol
 *
 * Purpose: Demonstrate a coordination pattern for private MEV/arbitrage
 * opportunities using encrypted price feeds. Price submissions and proposed
 * arbitrage actions are encrypted (`euint32`) and a trusted gateway/operator
 * finalizes profitable opportunities by providing encrypted settlement
 * details. This example focuses on data flow and privacy patterns, not
 * on the complexities of real MEV execution.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract MEVArbitragePremium {
    address public owner;

    // symbol hash -> encrypted price
    mapping(bytes32 => euint32) public encryptedPrice;

    struct ArbitrageProposal {
        address proposer;
        bytes32 buySymbol;
        bytes32 sellSymbol;
        euint32 encryptedProfit; // encrypted expected profit
        bool executed;
        bool exists;
    }

    uint256 public proposalCount;
    mapping(uint256 => ArbitrageProposal) public proposals;

    event PriceSubmitted(bytes32 indexed symbol, euint32 encryptedPrice);
    event ArbitrageProposed(uint256 indexed id, address indexed proposer, bytes32 buySymbol, bytes32 sellSymbol, euint32 encryptedProfit);
    event ArbitrageFinalized(uint256 indexed id, address indexed executor, euint32 encryptedProfit);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Submit an encrypted price for a symbol (e.g., "ETH/USDC")
    function submitEncryptedPrice(bytes32 symbol, euint32 price) external {
        encryptedPrice[symbol] = price;
        emit PriceSubmitted(symbol, price);
    }

    /// Propose an arbitrage opportunity between two symbols with expected encrypted profit
    function proposeArbitrage(bytes32 buySymbol, bytes32 sellSymbol, euint32 encryptedProfit) external returns (uint256) {
        uint256 id = proposalCount++;
        proposals[id] = ArbitrageProposal({ proposer: msg.sender, buySymbol: buySymbol, sellSymbol: sellSymbol, encryptedProfit: encryptedProfit, executed: false, exists: true });
        emit ArbitrageProposed(id, msg.sender, buySymbol, sellSymbol, encryptedProfit);
        return id;
    }

    /// Owner/gateway finalizes an arbitrage: records execution and emits encrypted profit
    function finalizeArbitrage(uint256 id, address executor, euint32 encryptedProfit) external onlyOwner {
        require(proposals[id].exists, "no-proposal");
        require(!proposals[id].executed, "already-executed");
        proposals[id].executed = true;
        emit ArbitrageFinalized(id, executor, encryptedProfit);
    }

    /// Helpers
    function priceOf(bytes32 symbol) external view returns (euint32) {
        return encryptedPrice[symbol];
    }
}
