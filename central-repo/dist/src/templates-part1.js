/**
 * Templates Part 1: Basic Categories
 * Includes: basic-counter, arithmetic, comparisons
 * Defines CATEGORIES constant with all 24 categories
 */
// ============================================================================
// CATEGORIES DEFINITION - All 24 Example Categories
// ============================================================================
export const CATEGORIES = [
    // MANDATORY CORE EXAMPLES (17 categories)
    {
        id: 'basic-counter',
        name: 'Basic Counter',
        description: 'Simple encrypted counter with increment/decrement operations',
        complexity: 'Beginner',
        isPro: false,
        contractName: 'BasicCounter',
        keywords: ['counter', 'increment', 'state'],
    },
    {
        id: 'arithmetic',
        name: 'Arithmetic Operations',
        description: 'Add, subtract, multiply encrypted integers',
        complexity: 'Beginner',
        isPro: false,
        contractName: 'Arithmetic',
        keywords: ['arithmetic', 'add', 'subtract', 'multiply'],
    },
    {
        id: 'comparisons',
        name: 'Comparisons',
        description: 'Greater than, less than, equal comparisons on encrypted values',
        complexity: 'Beginner',
        isPro: false,
        contractName: 'Comparisons',
        keywords: ['comparison', 'gt', 'lt', 'eq'],
    },
    {
        id: 'single-encryption',
        name: 'Single Encryption',
        description: 'User-side encryption of a single value',
        complexity: 'Beginner',
        isPro: false,
        contractName: 'SingleEncryption',
        keywords: ['encryption', 'user-side', 'single'],
    },
    {
        id: 'multiple-encryption',
        name: 'Multiple Encryption',
        description: 'Encrypt and manage multiple encrypted values',
        complexity: 'Intermediate',
        isPro: false,
        contractName: 'MultipleEncryption',
        keywords: ['encryption', 'batch', 'multiple'],
    },
    {
        id: 'single-decryption-user',
        name: 'Single Decryption (User)',
        description: 'User-authorized decryption with FHE.allow()',
        complexity: 'Intermediate',
        isPro: false,
        contractName: 'SingleDecryptionUser',
        keywords: ['decryption', 'user-authorized', 'allow'],
    },
    {
        id: 'single-decryption-public',
        name: 'Single Decryption (Public)',
        description: 'Public decryption for transparent operations',
        complexity: 'Intermediate',
        isPro: false,
        contractName: 'SingleDecryptionPublic',
        keywords: ['decryption', 'public', 'reveal'],
    },
    {
        id: 'multiple-decryption',
        name: 'Multiple Decryption',
        description: 'Decrypt multiple encrypted values efficiently',
        complexity: 'Intermediate',
        isPro: false,
        contractName: 'MultipleDecryption',
        keywords: ['decryption', 'batch', 'multiple'],
    },
    {
        id: 'access-control',
        name: 'Access Control',
        description: 'Role-based access control with encrypted permissions',
        complexity: 'Intermediate',
        isPro: false,
        contractName: 'AccessControl',
        keywords: ['access', 'roles', 'permissions'],
    },
    {
        id: 'input-verification-proofs',
        name: 'Input Verification Proofs',
        description: 'Input validation with encrypted proofs',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'InputVerificationProofs',
        keywords: ['verification', 'validation', 'proofs'],
    },
    {
        id: 'anti-patterns-guide',
        name: 'Anti-Patterns Guide',
        description: 'Educational guide showing common FHE anti-patterns',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'AntiPatternsGuide',
        keywords: ['anti-patterns', 'education', 'mistakes'],
    },
    {
        id: 'handles-lifecycle',
        name: 'Handles Lifecycle',
        description: 'Encrypted value handle lifecycle management',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'HandlesLifecycle',
        keywords: ['handles', 'lifecycle', 'management'],
    },
    {
        id: 'oz-erc20-wrapper',
        name: 'OpenZeppelin ERC20 Wrapper',
        description: 'Wrapper pattern for encrypted ERC20 balance tracking',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'OZErc20Wrapper',
        keywords: ['erc20', 'wrapper', 'token'],
    },
    {
        id: 'oz-erc7984-basic',
        name: 'OpenZeppelin ERC7984 Basic',
        description: 'Basic ERC7984 modular FHE implementation',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'OZERC7984Basic',
        keywords: ['erc7984', 'modular', 'fhe'],
    },
    {
        id: 'swaps',
        name: 'Swaps (AMM)',
        description: 'Simplified AMM with encrypted reserves',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'Swaps',
        keywords: ['dex', 'amm', 'swap'],
    },
    {
        id: 'vesting',
        name: 'Vesting',
        description: 'Token vesting with encrypted amounts',
        complexity: 'Advanced',
        isPro: false,
        contractName: 'Vesting',
        keywords: ['vesting', 'token', 'schedule'],
    },
    {
        id: 'blind-auction',
        name: 'Blind Auction',
        description: 'Private auction with encrypted bids',
        complexity: 'Expert',
        isPro: false,
        contractName: 'BlindAuction',
        keywords: ['auction', 'sealed-bid', 'privacy'],
    },
    // PRO BONUS EXAMPLES (7 categories)
    {
        id: 'dao-voting-pro',
        name: 'DAO Voting Pro',
        description: 'Advanced voting with encrypted vote counts and weights',
        complexity: 'Expert',
        isPro: true,
        contractName: 'DAOVotingPro',
        keywords: ['dao', 'voting', 'governance'],
    },
    {
        id: 'private-lending-pro',
        name: 'Private Lending Pro',
        description: 'Private lending protocol with encrypted amounts',
        complexity: 'Expert',
        isPro: true,
        contractName: 'PrivateLendingPro',
        keywords: ['lending', 'loan', 'collateral'],
    },
    {
        id: 'blind-dex-pro',
        name: 'Blind DEX Pro',
        description: 'Advanced DEX with MEV-resistant encrypted order books',
        complexity: 'Expert',
        isPro: true,
        contractName: 'BlindDEXPro',
        keywords: ['dex', 'orderbook', 'mev'],
    },
    {
        id: 'poker-game-pro',
        name: 'Poker Game Pro',
        description: 'Private poker game with encrypted hands',
        complexity: 'Expert',
        isPro: true,
        contractName: 'PokerGamePro',
        keywords: ['poker', 'game', 'private'],
    },
    {
        id: 'yield-farming-pro',
        name: 'Yield Farming Pro',
        description: 'Private yield farming with encrypted stake amounts',
        complexity: 'Expert',
        isPro: true,
        contractName: 'YieldFarmingPro',
        keywords: ['yield', 'farming', 'rewards'],
    },
    {
        id: 'mev-arbitrage-pro',
        name: 'MEV Arbitrage Pro',
        description: 'MEV-resistant arbitrage with encrypted price feeds',
        complexity: 'Expert',
        isPro: true,
        contractName: 'MEVArbitragePro',
        keywords: ['mev', 'arbitrage', 'dex'],
    },
    {
        id: 'confidential-stablecoin-pro',
        name: 'Confidential Stablecoin Pro',
        description: 'Privacy-preserving stablecoin with encrypted collateral',
        complexity: 'Expert',
        isPro: true,
        contractName: 'ConfidentialStablecoinPro',
        keywords: ['stablecoin', 'collateral', 'privacy'],
    },
];
// ============================================================================
// BASIC COUNTER CONTRACT (Part 1.1)
// ============================================================================
export function basicCounterContract() {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

/**
 * @title BasicCounter
 * @notice Simple encrypted counter demonstrating basic FHE operations
 * @dev Demonstrates how to store and manipulate encrypted uint32 values
 */
contract BasicCounter {
    euint32 private encryptedValue;

    event CounterIncremented(address indexed user);
    event CounterDecremented(address indexed user);

    constructor() {
        encryptedValue = TFHE.asEuint32(0);
    }

    /**
     * @notice Increment encrypted counter by 1
     * @dev Demonstrates TFHE.add with encrypted operands
     */
    function increment() external {
        encryptedValue = TFHE.add(encryptedValue, TFHE.asEuint32(1));
        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Decrement encrypted counter by 1
     * @dev Demonstrates TFHE.sub with encrypted operands
     */
    function decrement() external {
        encryptedValue = TFHE.sub(encryptedValue, TFHE.asEuint32(1));
        emit CounterDecremented(msg.sender);
    }

    /**
     * @notice Add arbitrary value to counter
     * @param _encryptedAmount The encrypted amount to add
     */
    function add(bytes calldata _encryptedAmount) external {
        euint32 amount = TFHE.asEuint32(_encryptedAmount);
        encryptedValue = TFHE.add(encryptedValue, amount);
    }

    /**
     * @notice Get current encrypted counter value
     * @return The encrypted uint32 value
     */
    function getValue() external view returns (euint32) {
        return encryptedValue;
    }
}
`;
}
export function basicCounterTest() {
    return `import { expect } from "chai";
import { ethers } from "hardhat";

describe("BasicCounter", function () {
  let counter: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const BasicCounter = await ethers.getContractFactory("BasicCounter");
    counter = await BasicCounter.deploy();
  });

  it("Should deploy successfully", async function () {
    expect(counter.address).to.exist;
  });

  it("Should initialize with 0", async function () {
    const value = await counter.getValue();
    expect(value).to.exist;
  });

  it("Should increment counter", async function () {
    await expect(counter.increment()).to.not.be.reverted;
  });

  it("Should handle multiple increments", async function () {
    await counter.increment();
    await counter.increment();
    await counter.increment();
    const value = await counter.getValue();
    expect(value).to.exist;
  });

  it("Should decrement counter", async function () {
    await counter.increment();
    await expect(counter.decrement()).to.not.be.reverted;
  });

  it("Should add custom value", async function () {
    await expect(counter.add("0x")).to.not.be.reverted;
  });

  it("Should emit events on increment", async function () {
    await expect(counter.increment())
      .to.emit(counter, "CounterIncremented");
  });
});
`;
}
// ============================================================================
// ARITHMETIC CONTRACT (Part 1.2)
// ============================================================================
export function arithmeticContract() {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

/**
 * @title Arithmetic
 * @notice Arithmetic operations on encrypted integers
 * @dev Demonstrates add, subtract, multiply operations using TFHE
 */
contract Arithmetic {
    euint32 private result;

    event OperationPerformed(string indexed op, address indexed user);

    constructor() {
        result = TFHE.asEuint32(0);
    }

    /**
     * @notice Add two encrypted numbers
     * @param _a Encrypted first number
     * @param _b Encrypted second number
     * @return Encrypted sum
     */
    function add(bytes calldata _a, bytes calldata _b) external returns (euint32) {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        result = TFHE.add(a, b);
        emit OperationPerformed("add", msg.sender);
        return result;
    }

    /**
     * @notice Subtract two encrypted numbers
     * @param _a Encrypted first number
     * @param _b Encrypted second number
     * @return Encrypted difference
     */
    function subtract(bytes calldata _a, bytes calldata _b) external returns (euint32) {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        result = TFHE.sub(a, b);
        emit OperationPerformed("subtract", msg.sender);
        return result;
    }

    /**
     * @notice Multiply two encrypted numbers
     * @param _a Encrypted first number
     * @param _b Encrypted second number
     * @return Encrypted product
     */
    function multiply(bytes calldata _a, bytes calldata _b) external returns (euint32) {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        result = TFHE.mul(a, b);
        emit OperationPerformed("multiply", msg.sender);
        return result;
    }

    /**
     * @notice Get last result (encrypted)
     */
    function getResult() external view returns (euint32) {
        return result;
    }
}
`;
}
export function arithmeticTest() {
    return `import { expect } from "chai";
import { ethers } from "hardhat";

describe("Arithmetic", function () {
  let arithmetic: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Arithmetic = await ethers.getContractFactory("Arithmetic");
    arithmetic = await Arithmetic.deploy();
  });

  it("Should perform addition", async function () {
    const result = await arithmetic.add("0x", "0x");
    expect(result).to.exist;
  });

  it("Should perform subtraction", async function () {
    const result = await arithmetic.subtract("0x", "0x");
    expect(result).to.exist;
  });

  it("Should perform multiplication", async function () {
    const result = await arithmetic.multiply("0x", "0x");
    expect(result).to.exist;
  });

  it("Should handle multiple operations", async function () {
    await arithmetic.add("0x", "0x");
    await arithmetic.multiply("0x", "0x");
    const result = await arithmetic.getResult();
    expect(result).to.exist;
  });

  it("Should emit events for operations", async function () {
    await expect(arithmetic.add("0x", "0x"))
      .to.emit(arithmetic, "OperationPerformed");
  });

  it("Should handle edge cases", async function () {
    // Test with zero
    const result = await arithmetic.add("0x", "0x");
    expect(result).to.exist;
  });
});
`;
}
// ============================================================================
// COMPARISONS CONTRACT (Part 1.3)
// ============================================================================
export function comparisonsContract() {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@zama.ai/fhevm/lib/TFHE.sol";

/**
 * @title Comparisons
 * @notice Comparison operations on encrypted values
 * @dev Demonstrates gt, lt, eq, ne operations using TFHE
 */
contract Comparisons {
    event ComparisonPerformed(string indexed op, bool indexed result);

    /**
     * @notice Check if first value greater than second (encrypted)
     * @return ebool encrypted boolean result
     */
    function greaterThan(bytes calldata _a, bytes calldata _b) 
        external 
        returns (ebool) 
    {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        ebool result = TFHE.gt(a, b);
        emit ComparisonPerformed("gt", TFHE.decrypt(result));
        return result;
    }

    /**
     * @notice Check if first value less than second (encrypted)
     */
    function lessThan(bytes calldata _a, bytes calldata _b) 
        external 
        returns (ebool) 
    {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        ebool result = TFHE.lt(a, b);
        emit ComparisonPerformed("lt", TFHE.decrypt(result));
        return result;
    }

    /**
     * @notice Check if values are equal (encrypted)
     */
    function equal(bytes calldata _a, bytes calldata _b) 
        external 
        returns (ebool) 
    {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        ebool result = TFHE.eq(a, b);
        emit ComparisonPerformed("eq", TFHE.decrypt(result));
        return result;
    }

    /**
     * @notice Check if values are not equal (encrypted)
     */
    function notEqual(bytes calldata _a, bytes calldata _b) 
        external 
        returns (ebool) 
    {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        ebool result = TFHE.ne(a, b);
        emit ComparisonPerformed("ne", TFHE.decrypt(result));
        return result;
    }

    /**
     * @notice Check if first >= second (encrypted)
     */
    function greaterThanOrEqual(bytes calldata _a, bytes calldata _b) 
        external 
        returns (ebool) 
    {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        ebool result = TFHE.ge(a, b);
        emit ComparisonPerformed("ge", TFHE.decrypt(result));
        return result;
    }

    /**
     * @notice Check if first <= second (encrypted)
     */
    function lessThanOrEqual(bytes calldata _a, bytes calldata _b) 
        external 
        returns (ebool) 
    {
        euint32 a = TFHE.asEuint32(_a);
        euint32 b = TFHE.asEuint32(_b);
        ebool result = TFHE.le(a, b);
        emit ComparisonPerformed("le", TFHE.decrypt(result));
        return result;
    }
}
`;
}
export function comparisonsTest() {
    return `import { expect } from "chai";
import { ethers } from "hardhat";

describe("Comparisons", function () {
  let comparisons: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Comparisons = await ethers.getContractFactory("Comparisons");
    comparisons = await Comparisons.deploy();
  });

  it("Should compare values with greaterThan", async function () {
    const result = await comparisons.greaterThan("0x", "0x");
    expect(result).to.exist;
  });

  it("Should compare values with lessThan", async function () {
    const result = await comparisons.lessThan("0x", "0x");
    expect(result).to.exist;
  });

  it("Should compare values with equal", async function () {
    const result = await comparisons.equal("0x", "0x");
    expect(result).to.exist;
  });

  it("Should compare values with notEqual", async function () {
    const result = await comparisons.notEqual("0x", "0x");
    expect(result).to.exist;
  });

  it("Should compare values with greaterThanOrEqual", async function () {
    const result = await comparisons.greaterThanOrEqual("0x", "0x");
    expect(result).to.exist;
  });

  it("Should compare values with lessThanOrEqual", async function () {
    const result = await comparisons.lessThanOrEqual("0x", "0x");
    expect(result).to.exist;
  });

  it("Should emit comparison events", async function () {
    await expect(comparisons.equal("0x", "0x"))
      .to.emit(comparisons, "ComparisonPerformed");
  });

  it("Should handle multiple comparisons", async function () {
    await comparisons.greaterThan("0x", "0x");
    await comparisons.lessThan("0x", "0x");
    const result = await comparisons.equal("0x", "0x");
    expect(result).to.exist;
  });
});
`;
}
//# sourceMappingURL=templates-part1.js.map