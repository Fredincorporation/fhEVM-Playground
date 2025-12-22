// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * BlindDEXPremium.sol
 *
 * Purpose: Demonstrate a privacy-preserving orderbook/DEX pattern where
 * orders are stored as encrypted primitives (`euint32`) and matching is
 * performed off-chain by a gateway which then provides encrypted settlement
 * details to finalize trades on-chain.
 *
 * This example is intentionally simple and educational — production-grade
 * orderbooks need careful anti-front-running, replay protection, and proofs.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract BlindDEXPremium {
    address public owner;

    struct Order {
        address maker;
        euint32 encryptedAmount; // encrypted amount
        euint32 encryptedPrice;  // encrypted price
        bool exists;
    }

    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

    event OrderPlaced(uint256 indexed id, address indexed maker, euint32 encryptedAmount, euint32 encryptedPrice);
    event OrderCancelled(uint256 indexed id);
    event TradeFinalized(uint256 indexed buyOrderId, uint256 indexed sellOrderId, euint32 encryptedAmount, euint32 encryptedPrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Place an encrypted order
    function placeOrder(euint32 encryptedAmount, euint32 encryptedPrice) external returns (uint256) {
        uint256 id = orderCount++;
        orders[id] = Order({ maker: msg.sender, encryptedAmount: encryptedAmount, encryptedPrice: encryptedPrice, exists: true });
        emit OrderPlaced(id, msg.sender, encryptedAmount, encryptedPrice);
        return id;
    }

    /// Cancel an open order
    function cancelOrder(uint256 id) external {
        Order storage o = orders[id];
        require(o.exists, "no-order");
        require(o.maker == msg.sender, "not-maker");
        delete orders[id];
        emit OrderCancelled(id);
    }

    /// Finalize a trade: owner (gateway operator) provides matched order ids
    /// and encrypted settlement details. In production, this should come with
    /// a verifiable signature from the gateway.
    function finalizeTrade(uint256 buyOrderId, uint256 sellOrderId, euint32 encryptedAmount, euint32 encryptedPrice) external onlyOwner {
        require(orders[buyOrderId].exists, "no-buy-order");
        require(orders[sellOrderId].exists, "no-sell-order");

        // remove orders to mark them filled
        delete orders[buyOrderId];
        delete orders[sellOrderId];

        emit TradeFinalized(buyOrderId, sellOrderId, encryptedAmount, encryptedPrice);
    }
}
