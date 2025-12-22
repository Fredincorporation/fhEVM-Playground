/**
 * Templates Part 5: PRO Bonus Examples
 * Includes: dao-voting-pro, private-lending-pro, blind-dex-pro, 
 *           poker-game-pro, yield-farming-pro, mev-arbitrage-pro,
 *           confidential-stablecoin-pro
 */

export function daoVotingProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract DAOVotingPro {
    struct Proposal {
        string description;
        euint32 encryptedYesVotes;
        euint32 encryptedNoVotes;
        uint256 deadline;
        bool executed;
    }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => euint32) public encryptedVotingPower;
    address public dao;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(address indexed voter, uint256 indexed proposalId);

    constructor() {
        dao = msg.sender;
    }

    function setVotingPower(address _member, bytes calldata _encryptedPower) external {
        require(msg.sender == dao, "Only DAO");
        encryptedVotingPower[_member] = TFHE.asEuint32(_encryptedPower);
    }

    function createProposal(string calldata _description, uint256 _votingPeriodSeconds) external returns (uint256) {
        uint256 proposalId = proposals.length;
        proposals.push(
            Proposal({
                description: _description,
                encryptedYesVotes: TFHE.asEuint32(0),
                encryptedNoVotes: TFHE.asEuint32(0),
                deadline: block.timestamp + _votingPeriodSeconds,
                executed: false
            })
        );
        emit ProposalCreated(proposalId, _description);
        return proposalId;
    }

    function vote(uint256 _proposalId, bytes calldata _isYes, bytes calldata _weight) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting closed");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        ebool isYes = TFHE.asEbool(_isYes);
        euint32 weight = TFHE.asEuint32(_weight);

        proposal.encryptedYesVotes = TFHE.add(
            proposal.encryptedYesVotes,
            TFHE.select(isYes, weight, TFHE.asEuint32(0))
        );

        proposal.encryptedNoVotes = TFHE.add(
            proposal.encryptedNoVotes,
            TFHE.select(isYes, TFHE.asEuint32(0), weight)
        );

        hasVoted[_proposalId][msg.sender] = true;
        emit VoteCast(msg.sender, _proposalId);
    }

    function getEncryptedVotes(uint256 _proposalId) external view returns (euint32, euint32) {
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.encryptedYesVotes, proposal.encryptedNoVotes);
    }
}
\`;
}

export function daoVotingProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAOVotingPro", function () {
  let dao: any;
  let owner: any;
  let voter1: any;

  beforeEach(async function () {
    [owner, voter1] = await ethers.getSigners();
    const DAO = await ethers.getContractFactory("DAOVotingPro");
    dao = await DAO.deploy();
  });

  it("Should create proposal", async function () {
    await expect(dao.createProposal("Fund development", 3600)).to.not.be.reverted;
  });

  it("Should allow voting", async function () {
    await dao.createProposal("Test proposal", 3600);
    await expect(dao.connect(voter1).vote(0, "0x", "0x")).to.not.be.reverted;
  });

  it("Should prevent double voting", async function () {
    await dao.createProposal("Test proposal", 3600);
    await dao.connect(voter1).vote(0, "0x", "0x");
    await expect(dao.connect(voter1).vote(0, "0x", "0x"))
      .to.be.revertedWith("Already voted");
  });
});
\`;
}

export function privateLendingProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract PrivateLendingPro {
    struct LendingPool {
        euint32 totalLiquidity;
        euint32 totalBorrowed;
        uint256 interestRate;
    }

    struct UserAccount {
        euint32 lentAmount;
        euint32 borrowedAmount;
        uint256 lastInterestUpdate;
    }

    LendingPool public pool;
    mapping(address => UserAccount) public accounts;

    event Deposited(address indexed user);
    event Borrowed(address indexed user);
    event Repaid(address indexed user);

    constructor() {
        pool.interestRate = 500;
        pool.totalLiquidity = TFHE.asEuint32(0);
        pool.totalBorrowed = TFHE.asEuint32(0);
    }

    function deposit(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        accounts[msg.sender].lentAmount = TFHE.add(accounts[msg.sender].lentAmount, amount);
        pool.totalLiquidity = TFHE.add(pool.totalLiquidity, amount);
        emit Deposited(msg.sender);
    }

    function borrow(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        ebool hasLiquidity = TFHE.ge(pool.totalLiquidity, amount);
        require(TFHE.decrypt(hasLiquidity), "Insufficient liquidity");

        accounts[msg.sender].borrowedAmount = TFHE.add(accounts[msg.sender].borrowedAmount, amount);
        pool.totalBorrowed = TFHE.add(pool.totalBorrowed, amount);
        pool.totalLiquidity = TFHE.sub(pool.totalLiquidity, amount);
        
        emit Borrowed(msg.sender);
    }

    function repay(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        accounts[msg.sender].borrowedAmount = TFHE.sub(accounts[msg.sender].borrowedAmount, amount);
        pool.totalBorrowed = TFHE.sub(pool.totalBorrowed, amount);
        pool.totalLiquidity = TFHE.add(pool.totalLiquidity, amount);
        emit Repaid(msg.sender);
    }

    function getAccountBalance(address _user) external view returns (euint32, euint32) {
        return (accounts[_user].lentAmount, accounts[_user].borrowedAmount);
    }
}
\`;
}

export function privateLendingProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("PrivateLendingPro", function () {
  let lending: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Lending = await ethers.getContractFactory("PrivateLendingPro");
    lending = await Lending.deploy();
  });

  it("Should deposit liquidity", async function () {
    await expect(lending.deposit("0x")).to.not.be.reverted;
  });

  it("Should allow borrowing with sufficient liquidity", async function () {
    await lending.deposit("0x");
    await expect(lending.borrow("0x")).to.not.be.reverted;
  });

  it("Should allow repayment", async function () {
    await lending.deposit("0x");
    await lending.borrow("0x");
    await expect(lending.repay("0x")).to.not.be.reverted;
  });
});
\`;
}

export function blindDexProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract BlindDEXPro {
    struct Order {
        address trader;
        string tokenIn;
        string tokenOut;
        euint32 amountIn;
        euint32 minAmountOut;
        uint256 nonce;
    }

    Order[] public orders;
    mapping(string => euint32) public tokenReserves;
    uint256 public orderNonce;

    event OrderPlaced(uint256 indexed orderId, address indexed trader);
    event OrderMatched(uint256 indexed order1, uint256 indexed order2);

    function placeOrder(
        string calldata _tokenIn,
        string calldata _tokenOut,
        bytes calldata _amountIn,
        bytes calldata _minAmountOut
    ) external returns (uint256) {
        uint256 orderId = orders.length;
        orders.push(
            Order({
                trader: msg.sender,
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                amountIn: TFHE.asEuint32(_amountIn),
                minAmountOut: TFHE.asEuint32(_minAmountOut),
                nonce: orderNonce++
            })
        );
        emit OrderPlaced(orderId, msg.sender);
        return orderId;
    }

    function matchOrders(uint256 _order1Id, uint256 _order2Id) external {
        Order storage order1 = orders[_order1Id];
        Order storage order2 = orders[_order2Id];

        require(
            keccak256(abi.encodePacked(order1.tokenIn)) == 
            keccak256(abi.encodePacked(order2.tokenOut)),
            "Token mismatch"
        );

        ebool canMatch = TFHE.ge(order1.amountIn, order2.minAmountOut);
        require(TFHE.decrypt(canMatch), "Insufficient amount");

        emit OrderMatched(_order1Id, _order2Id);
    }

    function getOrderCount() external view returns (uint256) {
        return orders.length;
    }
}
\`;
}

export function blindDexProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("BlindDEXPro", function () {
  let dex: any;
  let owner: any;
  let trader1: any;

  beforeEach(async function () {
    [owner, trader1] = await ethers.getSigners();
    const BlindDEX = await ethers.getContractFactory("BlindDEXPro");
    dex = await BlindDEX.deploy();
  });

  it("Should place order", async function () {
    await expect(dex.connect(trader1).placeOrder("ETH", "USDC", "0x", "0x")).to.not.be.reverted;
  });

  it("Should track orders", async function () {
    await dex.connect(trader1).placeOrder("ETH", "USDC", "0x", "0x");
    expect(await dex.getOrderCount()).to.equal(1);
  });
});
\`;
}

export function pokerGameProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract PokerGamePro {
    struct Game {
        address[] players;
        mapping(address => euint32[]) encryptedHands;
        euint32 pot;
        uint256 gameStartTime;
        bool active;
    }

    Game[] public games;

    event GameCreated(uint256 indexed gameId, address[] players);
    event CardDealt(uint256 indexed gameId, address indexed player);

    function createGame(address[] calldata _players) external returns (uint256) {
        uint256 gameId = games.length;
        games.push();
        Game storage game = games[gameId];
        game.players = _players;
        game.gameStartTime = block.timestamp;
        game.active = true;
        game.pot = TFHE.asEuint32(0);
        emit GameCreated(gameId, _players);
        return gameId;
    }

    function dealCard(uint256 _gameId, address _player, bytes calldata _encryptedCard) external {
        Game storage game = games[_gameId];
        require(game.active, "Game not active");
        game.encryptedHands[_player].push(TFHE.asEuint32(_encryptedCard));
        emit CardDealt(_gameId, _player);
    }

    function placeBet(uint256 _gameId, bytes calldata _amount) external {
        Game storage game = games[_gameId];
        require(game.active, "Game not active");
        euint32 amount = TFHE.asEuint32(_amount);
        game.pot = TFHE.add(game.pot, amount);
    }

    function getHandSize(uint256 _gameId, address _player) external view returns (uint256) {
        return games[_gameId].encryptedHands[_player].length;
    }
}
\`;
}

export function pokerGameProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("PokerGamePro", function () {
  let poker: any;
  let owner: any;
  let player1: any;

  beforeEach(async function () {
    [owner, player1] = await ethers.getSigners();
    const Poker = await ethers.getContractFactory("PokerGamePro");
    poker = await Poker.deploy();
  });

  it("Should create game", async function () {
    const players = [player1.address];
    await expect(poker.createGame(players)).to.not.be.reverted;
  });

  it("Should deal cards", async function () {
    const players = [player1.address];
    await poker.createGame(players);
    await expect(poker.dealCard(0, player1.address, "0x")).to.not.be.reverted;
  });

  it("Should track hand size", async function () {
    const players = [player1.address];
    await poker.createGame(players);
    await poker.dealCard(0, player1.address, "0x");
    const size = await poker.getHandSize(0, player1.address);
    expect(size).to.equal(1);
  });
});
\`;
}

export function yieldFarmingProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract YieldFarmingPro {
    struct Farm {
        euint32 totalStaked;
        euint32 accRewardPerShare;
        uint256 rewardRate;
        uint256 lastBlockReward;
    }

    struct UserStake {
        euint32 amount;
        euint32 rewardDebt;
    }

    Farm public farm;
    mapping(address => UserStake) public stakes;

    event Staked(address indexed user);
    event Harvested(address indexed user);

    constructor() {
        farm.totalStaked = TFHE.asEuint32(0);
        farm.accRewardPerShare = TFHE.asEuint32(0);
        farm.rewardRate = 100;
        farm.lastBlockReward = block.number;
    }

    function stake(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        updateFarm();
        
        stakes[msg.sender].rewardDebt = TFHE.add(
            stakes[msg.sender].rewardDebt,
            TFHE.mul(amount, farm.accRewardPerShare)
        );
        stakes[msg.sender].amount = TFHE.add(stakes[msg.sender].amount, amount);
        farm.totalStaked = TFHE.add(farm.totalStaked, amount);
        
        emit Staked(msg.sender);
    }

    function unstake(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        updateFarm();
        stakes[msg.sender].amount = TFHE.sub(stakes[msg.sender].amount, amount);
        farm.totalStaked = TFHE.sub(farm.totalStaked, amount);
    }

    function updateFarm() internal {
        if (block.number <= farm.lastBlockReward) return;
        uint256 blocksPassed = block.number - farm.lastBlockReward;
        euint32 rewards = TFHE.asEuint32(uint32(blocksPassed * farm.rewardRate));
        farm.accRewardPerShare = TFHE.add(farm.accRewardPerShare, rewards);
        farm.lastBlockReward = block.number;
    }

    function getUserStake(address _user) external view returns (euint32) {
        return stakes[_user].amount;
    }
}
\`;
}

export function yieldFarmingProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("YieldFarmingPro", function () {
  let farm: any;

  beforeEach(async function () {
    const YieldFarm = await ethers.getContractFactory("YieldFarmingPro");
    farm = await YieldFarm.deploy();
  });

  it("Should allow staking", async function () {
    await expect(farm.stake("0x")).to.not.be.reverted;
  });

  it("Should allow unstaking", async function () {
    await farm.stake("0x");
    await expect(farm.unstake("0x")).to.not.be.reverted;
  });
});
\`;
}

export function mevArbitrageProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract MEVArbitragePro {
    struct ArbitrageOpportunity {
        string dexA;
        string dexB;
        euint32 encryptedPriceA;
        euint32 encryptedPriceB;
        euint32 encryptedProfit;
        address executor;
        bool executed;
    }

    ArbitrageOpportunity[] public opportunities;
    mapping(address => euint32) public executorProfits;

    event OpportunityDetected(uint256 indexed opportunityId);
    event ArbitrageExecuted(uint256 indexed opportunityId, address indexed executor);

    function submitPrices(
        string calldata _dexA,
        string calldata _dexB,
        bytes calldata _priceA,
        bytes calldata _priceB
    ) external returns (uint256) {
        uint256 oppId = opportunities.length;
        euint32 encPriceA = TFHE.asEuint32(_priceA);
        euint32 encPriceB = TFHE.asEuint32(_priceB);

        ebool isProfitable = TFHE.lt(encPriceA, encPriceB);
        euint32 profit = TFHE.select(isProfitable, TFHE.sub(encPriceB, encPriceA), TFHE.asEuint32(0));

        opportunities.push(
            ArbitrageOpportunity({
                dexA: _dexA,
                dexB: _dexB,
                encryptedPriceA: encPriceA,
                encryptedPriceB: encPriceB,
                encryptedProfit: profit,
                executor: address(0),
                executed: false
            })
        );

        emit OpportunityDetected(oppId);
        return oppId;
    }

    function executeArbitrage(uint256 _oppId) external {
        ArbitrageOpportunity storage opp = opportunities[_oppId];
        require(!opp.executed, "Already executed");
        require(opp.executor == address(0), "Already assigned");

        opp.executor = msg.sender;
        opp.executed = true;

        executorProfits[msg.sender] = TFHE.add(executorProfits[msg.sender], opp.encryptedProfit);

        emit ArbitrageExecuted(_oppId, msg.sender);
    }

    function getOpportunityCount() external view returns (uint256) {
        return opportunities.length;
    }
}
\`;
}

export function mevArbitrageProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("MEVArbitragePro", function () {
  let arb: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Arb = await ethers.getContractFactory("MEVArbitragePro");
    arb = await Arb.deploy();
  });

  it("Should submit price pairs", async function () {
    await expect(arb.submitPrices("Uniswap", "SushiSwap", "0x", "0x")).to.not.be.reverted;
  });

  it("Should detect opportunities", async function () {
    await arb.submitPrices("Uniswap", "SushiSwap", "0x", "0x");
    expect(await arb.getOpportunityCount()).to.equal(1);
  });
});
\`;
}

export function confidentialStablecoinProContract(): string {
  return \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

contract ConfidentialStablecoinPro {
    string public constant name = "Confidential USD";
    string public constant symbol = "cUSD";
    uint8 public constant decimals = 18;

    euint32 public encryptedTotalSupply;
    euint32 public encryptedTotalCollateral;
    uint256 public collateralizationRatio = 150;

    mapping(address => euint32) private encryptedBalances;
    mapping(address => euint32) private encryptedCollateral;

    address public collateralToken;
    address public owner;

    event Minted(address indexed user);
    event Burned(address indexed user);

    constructor(address _collateralToken) {
        owner = msg.sender;
        collateralToken = _collateralToken;
        encryptedTotalSupply = TFHE.asEuint32(0);
        encryptedTotalCollateral = TFHE.asEuint32(0);
    }

    function depositCollateral(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        encryptedCollateral[msg.sender] = TFHE.add(encryptedCollateral[msg.sender], amount);
        encryptedTotalCollateral = TFHE.add(encryptedTotalCollateral, amount);
    }

    function mint(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        euint32 requiredCollateral = TFHE.div(
            TFHE.mul(amount, TFHE.asEuint32(uint32(collateralizationRatio))),
            TFHE.asEuint32(100)
        );
        
        ebool hasSufficientCollateral = TFHE.ge(encryptedCollateral[msg.sender], requiredCollateral);
        require(TFHE.decrypt(hasSufficientCollateral), "Insufficient collateral");
        
        encryptedBalances[msg.sender] = TFHE.add(encryptedBalances[msg.sender], amount);
        encryptedTotalSupply = TFHE.add(encryptedTotalSupply, amount);
        emit Minted(msg.sender);
    }

    function burn(bytes calldata _amount) external {
        euint32 amount = TFHE.asEuint32(_amount);
        encryptedBalances[msg.sender] = TFHE.sub(encryptedBalances[msg.sender], amount);
        encryptedTotalSupply = TFHE.sub(encryptedTotalSupply, amount);
        emit Burned(msg.sender);
    }

    function balanceOf(address _user) external view returns (euint32) {
        return encryptedBalances[_user];
    }

    function getCollateral(address _user) external view returns (euint32) {
        return encryptedCollateral[_user];
    }
}
\`;
}

export function confidentialStablecoinProTest(): string {
  return \`import { expect } from "chai";
import { ethers } from "hardhat";

describe("ConfidentialStablecoinPro", function () {
  let stablecoin: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Stablecoin = await ethers.getContractFactory("ConfidentialStablecoinPro");
    stablecoin = await Stablecoin.deploy(owner.address);
  });

  it("Should deposit collateral", async function () {
    await expect(stablecoin.depositCollateral("0x")).to.not.be.reverted;
  });

  it("Should mint stablecoin with collateral", async function () {
    await stablecoin.depositCollateral("0x");
    await expect(stablecoin.mint("0x")).to.not.be.reverted;
  });

  it("Should burn stablecoin", async function () {
    await stablecoin.depositCollateral("0x");
    await stablecoin.mint("0x");
    await expect(stablecoin.burn("0x")).to.not.be.reverted;
  });
});
\`;
}
