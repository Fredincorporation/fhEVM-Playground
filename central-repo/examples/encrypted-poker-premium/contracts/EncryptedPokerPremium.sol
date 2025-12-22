// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
 * EncryptedPokerPremium.sol
 *
 * Purpose: Educational example showing encrypted hand submission and
 * gateway-finalized winner selection. Hands are stored as encrypted
 * primitives (`euint32`) and the gateway performs dealing, shuffling,
 * and winner determination off-chain.
 */

import { TFHE, euint32 } from "fhevm/lib/TFHE.sol";

contract EncryptedPokerPremium {
    address public owner;

    struct Game {
        address[] players;
        mapping(address => euint32) encryptedHands;
        euint32 pot; // encrypted pot
        bool started;
        address winner;
        euint32 winningHand; // encrypted winning hand
        bool finalized;
        bool exists;
    }

    uint256 public gameCount;
    mapping(uint256 => Game) private games;

    event GameCreated(uint256 indexed gameId, address indexed creator, address[] players);
    event HandSubmitted(uint256 indexed gameId, address indexed player, euint32 encryptedHand);
    event GameStarted(uint256 indexed gameId);
    event GameFinalized(uint256 indexed gameId, address indexed winner, euint32 encryptedWinningHand, euint32 encryptedPot);

    modifier onlyOwner() {
        require(msg.sender == owner, "not-owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// Create a game and register players
    function createGame(address[] calldata players) external returns (uint256) {
        uint256 id = gameCount++;
        Game storage g = games[id];
        for (uint256 i = 0; i < players.length; i++) {
            g.players.push(players[i]);
        }
        g.exists = true;
        emit GameCreated(id, msg.sender, players);
        return id;
    }

    /// Players submit their encrypted hand (e.g., encoded cards ciphertext)
    function submitHand(uint256 gameId, euint32 encryptedHand) external {
        Game storage g = games[gameId];
        require(g.exists, "no-game");
        require(!g.started, "already-started");
        // record encrypted hand
        g.encryptedHands[msg.sender] = encryptedHand;
        emit HandSubmitted(gameId, msg.sender, encryptedHand);
    }

    /// Start the game (no further hand submissions allowed)
    function startGame(uint256 gameId, euint32 encryptedInitialPot) external onlyOwner {
        Game storage g = games[gameId];
        require(g.exists, "no-game");
        g.started = true;
        g.pot = TFHE.add(g.pot, encryptedInitialPot);
        emit GameStarted(gameId);
    }

    /// Finalize the game: gateway/owner provides winner and encrypted winning hand and pot
    function finalizeGame(uint256 gameId, address winningPlayer, euint32 encryptedWinningHand, euint32 encryptedPot) external onlyOwner {
        Game storage g = games[gameId];
        require(g.exists, "no-game");
        require(g.started, "not-started");
        require(!g.finalized, "already-finalized");
        g.winner = winningPlayer;
        g.winningHand = encryptedWinningHand;
        g.pot = encryptedPot;
        g.finalized = true;
        emit GameFinalized(gameId, winningPlayer, encryptedWinningHand, encryptedPot);
    }

    /// View functions
    function playersOf(uint256 gameId) external view returns (address[] memory) {
        return games[gameId].players;
    }

    function encryptedHandOf(uint256 gameId, address player) external view returns (euint32) {
        return games[gameId].encryptedHands[player];
    }

    function gameInfo(uint256 gameId) external view returns (address[] memory, euint32, bool, address, euint32, bool) {
        Game storage g = games[gameId];
        return (g.players, g.pot, g.started, g.winner, g.winningHand, g.finalized);
    }
}
