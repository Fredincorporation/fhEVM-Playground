# System Architecture

fhEVM Playground Pro is a CLI-based scaffolding system for generating production-ready fhEVM smart contract examples. This document describes the architecture, design decisions, and module relationships.

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User (CLI Entry Point)                   │
│              create-fhevm-playground-pro create             │
│                  --name my-example                          │
│                  --category basic-counter                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   CLI Parser (Commander.js)    │
        │  bin/create-fhevm-playground   │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │     Scaffolder (Main Logic)    │
        │     src/scaffolder.ts          │
        │  - Validate inputs             │
        │  - Create directory            │
        │  - Generate files              │
        └────────────────┬───────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Template Dispatcher │        │  Doc Generator       │
│  src/templates-idx   │        │  src/doc-generator   │
│  - Get contract      │        │  - Parse JSDoc       │
│  - Get test          │        │  - Generate README   │
│  - Get readme        │        └──────────────────────┘
└──────────┬───────────┘
           │
    ┌──────┴──────┬──────────┬──────────┬──────────┐
    │             │          │          │          │
    ▼             ▼          ▼          ▼          ▼
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Part 1   │ │  Part 2  │ │  Part 3  │ │  Part 4  │ │  Part 5  │
│3 Core   │ │ 5 Crypto │ │ 4 Access │ │ 5 ERC20  │ │ 7 PRO    │
│Examples │ │ Examples │ │ Examples │ │ Examples │ │ Examples │
└─────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘

        ┌─────────────────────────────────────┐
        │   Generated Example Project         │
        │  (in examples/<project-name>/)      │
        │ - contracts/Contract.sol            │
        │ - test/contract.test.ts             │
        │ - hardhat.config.ts                 │
        │ - package.json                      │
        │ - README.md (auto-generated)        │
        └─────────────────────────────────────┘
```

## Module Architecture

### 1. CLI Entry Point (`bin/create-fhevm-playground-pro.ts`)

**Purpose**: Parse command-line arguments and delegate to scaffolder

**Responsibilities**:
- Parse `create` command with options (`--name`, `--category`, `--pro`)
- Parse `list` command to display available categories
- Handle help and version flags
- Validate option combinations
- Delegate to scaffolder for file generation

**Key Dependencies**:
- `commander` - CLI parsing library
- `src/scaffolder` - Core logic
- `src/templates-index` - Category list

**Flow**:
```
parse args
  ├─ if create: validate → scaffolder.createExample()
  ├─ if list: templates-index.CATEGORIES → format & display
  └─ if --version: display version
```

### 2. Scaffolder (`src/scaffolder.ts`)

**Purpose**: Core logic for creating example projects

**Responsibilities**:
- Validate project name and category
- Create directory structure
- Generate configuration files (package.json, hardhat.config.ts, tsconfig.json)
- Write contract and test files from templates
- Generate documentation
- Initialize git (optional)

**Key Functions**:
- `createExample(options: CreateOptions)` - Main entry point
- `ensureExamplesDir()` - Create examples/ directory if needed
- `writeConfigFiles()` - Generate hardhat.config.ts, tsconfig.json, .gitignore
- `writeContractFiles()` - Write Solidity contracts
- `writeTestFiles()` - Write Mocha test files
- `writeDocumentation()` - Generate README using doc-generator
- `initializeGit()` - Optional git initialization

**Dependencies**:
- `fs-extra` - File system operations
- `path` - Path utilities
- `src/utils` - Validation and conversion
- `src/templates-index` - Get templates for category
- `src/doc-generator` - Generate README files
- `chalk` - Colored console output

**Error Handling**:
- Validates project names (alphanumeric, hyphens, underscores)
- Checks if category exists
- Prevents overwriting existing directories
- Clear error messages for each failure case

### 3. Utilities (`src/utils.ts`)

**Purpose**: Reusable helper functions

**Key Functions**:
- `ensureValidProjectName(name)` - Validates project name format
- `toPascalCase(str)` - Converts kebab-case to PascalCase
- `toCamelCase(str)` - Converts kebab-case to camelCase
- `getContractClassName(category)` - Gets contract class name for category

**Usage Pattern**:
```typescript
// Category: "basic-counter" →
getContractClassName("basic-counter") // "BasicCounter"
toPascalCase("basic-counter")         // "BasicCounter"
toCamelCase("basic-counter")          // "basicCounter"
```

**Design Rationale**: Centralized conversion logic prevents inconsistencies across templates.

### 4. Template System (`src/templates-part1.ts` through `src/templates-part5.ts`)

**Purpose**: Store contract, test, and documentation templates for each category

**Design**: Split across 5 files to manage file size:
- **Part 1** (3 categories): BasicCounter, Arithmetic, Comparisons - Foundational patterns
- **Part 2** (5 categories): Encryption/Decryption - User-side operations
- **Part 3** (4 categories): AccessControl, InputProofs, AntiPatterns, Handles - Security patterns
- **Part 4** (5 categories): OZ ERC20, ERC7984, Swaps, Vesting, BlindAuction - Real-world patterns
- **Part 5** (7 categories): PRO examples - Advanced patterns (DAO, Lending, DEX, Poker, Yield, MEV, Stablecoin)

**Each Category Exports**:
```typescript
export const CATEGORY_NAME_CONTRACT = `...solidity...`;
export const CATEGORY_NAME_TEST = `...typescript...`;
export const CATEGORY_NAME_README = `...markdown...`;
export const CATEGORY_NAME_CATEGORY: Category = {
  name: "category-name",
  displayName: "Display Name",
  description: "...",
  complexity: "intermediate",
  keywords: ["keyword1", "keyword2"],
  isPro: false,
};
```

**Why 5 Files?**
- Prevents single file >2000 lines
- Enables parallel editing
- Organizes by complexity/domain
- Easier to maintain and extend
- Reduces build complexity

### 5. Template Dispatcher (`src/templates-index.ts`)

**Purpose**: Unified interface to all templates

**Responsibilities**:
- Export `CATEGORIES` constant (array of all 24 categories)
- Dispatch `getContractTemplate(categoryName)` 
- Dispatch `getTestTemplate(categoryName)`
- Dispatch `getReadmeTemplate(categoryName)`
- Map category names to implementations

**Design Pattern**: Switch statements for efficient lookup

```typescript
export function getContractTemplate(categoryName: string): string {
  switch (categoryName.toLowerCase()) {
    case "basic-counter":
      return BASIC_COUNTER_CONTRACT;
    case "arithmetic":
      return ARITHMETIC_CONTRACT;
    // ... 22 more cases
    default:
      throw new Error(`Unknown category: ${categoryName}`);
  }
}
```

**Why This Design?**
- Single responsibility: template access only
- Scaffolder doesn't need to know about file organization
- Easy to add/remove categories
- Type-safe mapping

### 6. Documentation Generator (`src/doc-generator.ts`)

**Purpose**: Parse Solidity JSDoc and generate Markdown

**Key Functions**:
- `extractJSDocBlocks(solidityCode)` - Regex-based extraction
- `parseDocBlock(docContent)` - Parse @param, @return, @notice, @dev, @deprecated
- `docBlocksToMarkdown(blocks)` - Format blocks as Markdown
- `generateContractMarkdown(contractName, solidityCode, description)` - Full contract docs
- `generateProjectReadme(projectName, category, contractNames)` - Project README
- `generateCategorySummary(categoryData)` - Format category metadata

**JSDoc Pattern**:
```solidity
/**
 * @notice This function does something important
 * @dev Important implementation details here
 * @param value Input value to process
 * @return result The computed result
 */
function myFunction(uint32 value) public returns (uint32) {
  // ...
}
```

**Markdown Output**:
```markdown
## Functions

### myFunction(uint32)

This function does something important

**Parameters:**
- `value` (uint32) - Input value to process

**Returns:**
- (uint32) - The computed result

**Implementation Notes:**
Important implementation details here
```

**Integration**: Scaffolder calls `generateProjectReadme()` when creating examples.

## Data Flow: "create" Command

```
User Input:
  npx create-fhevm-playground-pro create --name my-counter --category basic-counter

┌─ CLI Parser ──────────────────────────────────────┐
│ name: "my-counter"                                │
│ category: "basic-counter"                         │
│ pro: false                                        │
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌─ Validation ──────────────────────────────────────┐
│ ✓ name matches /^[a-zA-Z0-9\-_]+$/                │
│ ✓ category exists in CATEGORIES                  │
│ ✓ ./examples/my-counter doesn't exist            │
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌─ Directory Creation ──────────────────────────────┐
│ mkdir -p examples/my-counter/contracts            │
│ mkdir -p examples/my-counter/test                 │
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌─ Template Lookup ─────────────────────────────────┐
│ contractCode = getContractTemplate("basic-counter")│
│ testCode = getTestTemplate("basic-counter")       │
│ readmeTemplate = getReadmeTemplate("basic-counter")│
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌─ File Generation ─────────────────────────────────┐
│ Contract: contracts/BasicCounter.sol              │
│ Test: test/basic-counter.test.ts                 │
│ Config: package.json, hardhat.config.ts, etc.    │
│ Docs: README.md (from doc-generator)             │
└──────────────────┬────────────────────────────────┘
                   │
                   ▼
┌─ Output ──────────────────────────────────────────┐
│ ✓ Example created: examples/my-counter/          │
│ Next steps: cd my-counter && npm install && npm test
└───────────────────────────────────────────────────┘
```

## Template Structure

### Contract Template Pattern

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title CategoryName
 * @notice Brief description
 * @dev Implementation details
 */
contract CategoryName is EIP712WithModifier, Reencrypt {
  // Constants
  string private constant SIGN_VERIFY_MESSAGE_HASH = ...;
  
  // State variables with encrypted types
  euint32 private encryptedValue;
  
  // Events
  event ValueUpdated(address indexed user);
  
  // Constructor
  constructor() EIP712WithModifier("CategoryName", "1") {}
  
  // External functions
  function publicFunction() external pure returns (uint32) {
    return 42;
  }
  
  // Internal functions
  function _internalLogic() internal view {
    // Implementation
  }
}
```

### Test Template Pattern

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import type { CategoryName } from "../typechain-types";
import { getSignatureAndEncryption, initGateway } from "fhevm";

describe("CategoryName", () => {
  let contract: CategoryName;
  let owner: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  before(async () => {
    await initGateway();
  });

  beforeEach(async () => {
    [owner, otherAccount] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("CategoryName");
    contract = await factory.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", () => {
    it("should deploy successfully", async () => {
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  describe("Functionality", () => {
    it("should perform expected behavior", async () => {
      const tx = await contract.publicFunction();
      expect(tx).to.equal(expected);
    });
  });
});
```

## Design Decisions

### 1. Split Templates Across 5 Files

**Decision**: Split 24 categories into templates-part1.ts through templates-part5.ts

**Rationale**:
- Single file would exceed 2,000+ lines
- Splits by conceptual grouping (basics, crypto, security, real-world, advanced)
- Allows parallel development
- Reduces cognitive load during maintenance

**Alternative Considered**: Single templates.ts file
- Simpler import structure
- Harder to navigate
- Risk of merge conflicts
- File size management issues

### 2. Unified Template Dispatcher

**Decision**: Central templates-index.ts with switch-based dispatch

**Rationale**:
- Single point for category/template lookup
- Scaffolder doesn't need to import from 5 files
- Easy to verify all categories are registered
- Type-safe error handling

**Alternative Considered**: Dynamic imports
- Could load only needed templates
- More complex implementation
- Overkill for 24 categories (~50KB total)

### 3. Separate Doc Generator Module

**Decision**: Dedicated doc-generator.ts for JSDoc → Markdown

**Rationale**:
- Follows single-responsibility principle
- Reusable for future tooling
- Can be tested independently
- Separates concerns (templates vs. documentation)

**Alternative Considered**: Inline documentation generation
- Simpler initially
- Hard to extend
- Mixes concerns

### 4. Modular Template Exports

**Decision**: Each category exports contract, test, readme, and category definition

**Rationale**:
- Self-contained category definitions
- Easy to verify completeness
- Enables consistency checking
- Facilitates testing

**Example**:
```typescript
export const BASIC_COUNTER_CONTRACT = "...";
export const BASIC_COUNTER_TEST = "...";
export const BASIC_COUNTER_README = "...";
export const BASIC_COUNTER_CATEGORY: Category = { ... };
```

## Extension Points

### Adding New Categories

1. **Create template exports** in appropriate `templates-part*.ts`
2. **Register in templates-index.ts** dispatcher
3. **Test locally** with scaffold command
4. **Update EXAMPLES_INDEX.md** documentation

### Adding New Commands

1. **Extend bin/create-fhevm-playground-pro.ts** with new command
2. **Implement command logic** in src/ module
3. **Add tests** for new command
4. **Update CLI documentation** in README.md

### Custom Scaffolding Hooks

Future extension point for custom scaffolder behavior:

```typescript
// Example future API
const scaffolder = new Scaffolder({
  hooks: {
    beforeCreate: (options) => { /* validate */ },
    afterCreate: (options) => { /* post-process */ },
    onError: (error) => { /* handle */ }
  }
});
```

## Performance Considerations

### Build Time
- TypeScript compilation: ~2-3 seconds
- No external API calls
- File I/O only for generation

### Runtime
- Template lookup: O(1) switch-based dispatch
- Directory creation: Platform-dependent (typically <100ms)
- File writing: Sequential, typically <500ms total

### Memory
- All templates loaded at startup (~2MB)
- Suitable for CLI tool constraints
- Can be optimized with lazy loading if needed

## Testing Strategy

### Unit Tests

**Test scaffolder.ts**:
- Validate project name rejection
- Verify category validation
- Check directory structure creation
- Confirm file content generation

**Test utils.ts**:
- Case conversion (kebab ↔ PascalCase)
- Name validation edge cases

**Test doc-generator.ts**:
- JSDoc extraction regex
- Tag parsing (@param, @return, @notice)
- Markdown formatting

### Integration Tests

**Test CLI command flow**:
- `create` command with valid options
- `create` command with invalid inputs
- `list` command output

**Test generated examples**:
- Can install dependencies
- Contracts compile without errors
- Tests execute and pass

### Manual Testing

1. Create example with each category
2. Verify generated contracts compile
3. Verify tests pass
4. Verify README is readable and accurate

## Dependencies Analysis

### Direct Dependencies
- `commander` (^11.0.0) - CLI parsing
- `chalk` (^5.0.0) - Colored output
- `fs-extra` (^11.0.0) - File operations
- `@zama.ai/fhevm` (^0.9.0) - Solidity contracts (devDependency)

### Why These?
- **commander**: Industry standard for Node CLIs
- **chalk**: Simple, maintained, no dependencies
- **fs-extra**: Handles edge cases (fs.mkdir, fs.writeFile)
- **@zama.ai/fhevm**: Official fhEVM library

### Zero Direct Dependencies in Contracts
- All Solidity contracts import only from @zama.ai/fhevm
- No ERC20 imports (examples implement own or use OpenZeppelin pattern)

## Deployment & Distribution

### Package Distribution
- Published to npm registry
- Installed globally: `npm install -g create-fhevm-playground-pro`
- Or used via npx: `npx create-fhevm-playground-pro`

### Binary Location
- Registered in package.json `bin` field
- Links to `bin/create-fhevm-playground-pro.ts` (compiled)
- Made executable on install

### TypeScript Distribution
- Source: TypeScript in src/
- Build: `npm run build` compiles to dist/
- Types: Generated .d.ts files for IDE support

## Security Considerations

### Input Validation
- Project names: alphanumeric, hyphens, underscores only
- Categories: whitelist from CATEGORIES array
- Paths: normalized to prevent directory traversal

### File Operations
- Uses fs-extra for safe operations
- Checks if directory exists before creation
- No arbitrary code execution (no `eval()`, no `execSync()`)

### Dependency Security
- Minimal dependencies (3 packages)
- All dependencies actively maintained
- Regular dependency updates via npm audit

## Future Improvements

### Possible Enhancements
1. **Config file support**: `.fhevmrc.json` for defaults
2. **Custom template paths**: Load templates from user directory
3. **Template previewing**: Display contract/test before creation
4. **Interactive mode**: Guided setup questions
5. **Package manager support**: yarn, pnpm alternatives
6. **Git integration**: Auto-commit on creation
7. **Remote examples**: Fetch examples from external registry
8. **Monitoring/telemetry**: (Optional, privacy-respecting)

### Design for Extension
Current architecture supports these additions via:
- Hook system (beforeCreate, afterCreate, onError)
- Configurable template paths
- Plugin system for custom commands
- Pluggable package managers

---

**Last Updated**: December 2025
**Maintainer**: fhEVM Playground Pro Team
