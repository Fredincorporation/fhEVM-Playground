# Contributing to fhEVM Playground Pro

Thank you for your interest in contributing to fhEVM Playground Pro! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- git
- Basic understanding of Solidity and TypeScript

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_GITHUB_ORG/fhevm-playground-pro.git
cd fhevm-playground-pro

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

### Project Structure Quick Tour

```
src/
├── scaffolder.ts         # Main scaffolding logic - entry point
├── utils.ts             # Helper functions (validation, case conversion)
├── doc-generator.ts     # JSDoc to Markdown converter
├── templates-index.ts   # Unified template dispatcher
├── templates-part1.ts   # Categories 1-3 (Basic Counter, Arithmetic, Comparisons)
├── templates-part2.ts   # Categories 4-8 (Encryption/Decryption)
├── templates-part3.ts   # Categories 9-12 (Access Control, etc.)
├── templates-part4.ts   # Categories 13-17 (OpenZeppelin patterns)
└── templates-part5.ts   # Categories 18-24 (PRO examples)

bin/
└── create-fhevm-playground-pro.ts  # CLI entry point

scripts/
├── batch-update-fhevm-version.sh   # Shell script for updates
└── batch-update-fhevm-version.ts   # TypeScript version
```

## Code Style & Standards

### TypeScript Guidelines

- **Strict Mode**: All TypeScript files use strict mode (`"strict": true`)
- **Formatting**: Use Prettier (auto-format on save recommended)
- **Linting**: Follow ESLint rules (error on violations)
- **Naming**:
  - Functions: `camelCase` (e.g., `createExample()`, `validateVersion()`)
  - Classes/Interfaces: `PascalCase` (e.g., `ContractTemplate`, `UpdateResult`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `CATEGORIES`)

### Solidity Guidelines

- **Version**: 0.8.24 (latest fhEVM compatible)
- **NatSpec**: Use `/** @notice ... */` for all public functions
- **Security**: Follow fhEVM best practices (see docs)
- **Gas Efficiency**: Minimize encrypted operations where possible
- **Comments**: Explain why, not what (code is already clear)

Example Solidity contract structure:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/abstracts/Reencrypt.sol";

/**
 * @title MyContractName
 * @notice [Brief description of contract functionality]
 * @dev [Technical details and implementation notes]
 */
contract MyContractName is EIP712WithModifier, Reencrypt {
  // Constants
  string private constant SIGN_VERIFY_MESSAGE_HASH = ...;
  
  // State variables
  euint32 private encryptedValue;
  
  /// @notice Initialize contract
  constructor() EIP712WithModifier("MyContract", "1") {}
  
  /// @notice [Function description]
  /// @param [param] [description]
  /// @return [return] [description]
  function myFunction(uint32 value) public {
    encryptedValue = TFHE.asEuint32(value);
  }
}
```

### Test Standards

- **Framework**: Mocha + Chai
- **File Naming**: `<contract-name>.test.ts`
- **Coverage**: Aim for >80% coverage minimum
- **Structure**:
  ```typescript
  describe("ContractName", () => {
    let contract: ContractName;
    let owner: SignerWithAddress;

    beforeEach(async () => {
      [owner] = await ethers.getSigners();
      contract = await deployContract();
    });

    describe("Function", () => {
      it("should do something specific", async () => {
        // Arrange
        const input = ...;
        
        // Act
        const result = await contract.function(input);
        
        // Assert
        expect(result).to.equal(expected);
      });
    });
  });
  ```

## Adding a New Example Category

### Step 1: Choose a Category

First, check if your category is already in [EXAMPLES_INDEX.md](./EXAMPLES_INDEX.md). If not:

1. Decide on a category name (kebab-case, e.g., `my-new-pattern`)
2. Determine complexity: `beginner`, `intermediate`, `advanced`, or `expert`
3. Decide if it's PRO (bonus) or core

### Step 2: Create the Template

Add to the appropriate `templates-part*.ts` file (or create new one if needed):

```typescript
// In src/templates-part<N>.ts

export const MY_NEW_PATTERN_CONTRACT = `
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";

/**
 * @title MyNewPattern
 * @notice [Your description]
 */
contract MyNewPattern is EIP712WithModifier {
  constructor() EIP712WithModifier("MyNewPattern", "1") {}
  
  // Implementation...
}
`;

export const MY_NEW_PATTERN_TEST = `
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNewPattern", () => {
  let contract: MyNewPattern;
  
  beforeEach(async () => {
    const factory = await ethers.getContractFactory("MyNewPattern");
    contract = await factory.deploy();
    await contract.waitForDeployment();
  });
  
  it("should work", async () => {
    // Test implementation...
  });
});
`;

export const MY_NEW_PATTERN_README = `# My New Pattern

[Description]
`;

// Add export in CATEGORIES constant
export const MY_NEW_PATTERN_CATEGORY: Category = {
  name: "my-new-pattern",
  displayName: "My New Pattern",
  description: "...",
  complexity: "intermediate",
  keywords: ["keyword1", "keyword2"],
  isPro: false,
};
```

### Step 3: Register in Templates Index

Update `src/templates-index.ts`:

```typescript
import {
  MY_NEW_PATTERN_CATEGORY,
  MY_NEW_PATTERN_CONTRACT,
  MY_NEW_PATTERN_TEST,
  MY_NEW_PATTERN_README,
} from "./templates-part<N>";

// In CATEGORIES array
CATEGORIES.push(MY_NEW_PATTERN_CATEGORY);

// Update getContractTemplate()
case "my-new-pattern":
  return MY_NEW_PATTERN_CONTRACT;

// Update getTestTemplate()
case "my-new-pattern":
  return MY_NEW_PATTERN_TEST;

// Update getReadmeTemplate()
case "my-new-pattern":
  return MY_NEW_PATTERN_README;
```

### Step 4: Test Locally

```bash
# Build
npm run build

# Test the scaffold command
npm run dev -- create --name test-new-pattern --category my-new-pattern

# Verify in generated project
cd test-new-pattern
npm install
npm test
```

### Step 5: Update Documentation

Update `EXAMPLES_INDEX.md` with your new category in the appropriate complexity section.

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "ContractName"

# Run with coverage
npm test -- --coverage
```

### Integration Testing

After adding a new category, verify the scaffold flow:

```bash
npm run build

# Test scaffold
npm run dev -- create --name test-example --category <your-category>

# Verify generated files
ls test-example/contracts/
ls test-example/test/
cat test-example/README.md

# Test the example
cd test-example
npm install
npm run compile
npm test
```

## Pull Request Process

### Before Submitting

1. **Branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit**: Use clear, descriptive commit messages
   ```bash
   git commit -m "feat: add new category pattern"
   git commit -m "fix: resolve edge case in template"
   git commit -m "docs: update EXAMPLES_INDEX"
   ```

3. **Build & Test**: Ensure everything builds and tests pass
   ```bash
   npm run build
   npm test
   ```

4. **Lint**: Check code style
   ```bash
   npm run lint
   ```

### PR Guidelines

In your PR description, include:

```markdown
## Description
[Brief description of changes]

## Type
- [ ] New category/template
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor
- [ ] Other: ___

## Checklist
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Tests added/updated for new code
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No unrelated changes included

## Related Issues
Closes #[issue number] (if applicable)

## Additional Context
[Any additional information reviewers should know]
```

### What to Expect

- Code review typically within 2-3 days
- May request changes or clarifications
- Once approved, we'll merge and deploy

## Commit Message Convention

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature or category
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, linting)
- `refactor`: Code refactoring without feature change
- `test`: Test additions or updates
- `chore`: Build, dependencies, etc.

**Examples:**
```
feat(templates): add encrypted-poker-pro category

docs(contributing): clarify template structure requirements

fix(scaffolder): resolve issue with directory creation on Windows
```

## Report Issues

Found a bug or have a feature request?

1. Check [existing issues](https://github.com/YOUR_GITHUB_ORG/fhevm-playground-pro/issues)
2. Use clear title and detailed description
3. Include reproduction steps if reporting a bug
4. Attach screenshots/logs if helpful

## Naming Conventions

### Category Names
- Use kebab-case (e.g., `basic-counter`, `blind-auction`)
- Be descriptive but concise
- PRO categories: append `-pro` suffix

### Function Names
- `create*()` for creation functions
- `validate*()` for validation
- `get*()` for retrieval
- `update*()` for mutations
- `generate*()` for document generation

### Variable Names
- `is*` for boolean properties
- `*Id` or `*Address` for identifiers
- Avoid single-letter variables except in loops

## FAQ

### How many examples should a PR include?

One category per PR is ideal. This makes review easier and changes are more focused.

### Can I modify existing categories?

Yes, but clearly indicate what changed in the PR description. Breaking changes need discussion.

### What if my category is very similar to an existing one?

Check [EXAMPLES_INDEX.md](./EXAMPLES_INDEX.md) first. If there's significant overlap, consider:
1. Adding to existing category's test suite
2. Creating a variant section in README
3. Reaching out via GitHub issue to discuss

### How are PRO examples different from core?

PRO examples showcase more advanced patterns. They may be:
- More complex implementations
- Combined patterns
- Real-world protocols
- Advanced optimizations

Mark with `isPro: true` in category definition.

## Questions?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review existing templates for patterns
- Open a GitHub Discussion for questions
- Contact: [maintainer contact info]

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Project acknowledgments
- Release notes (if applicable)

Thank you for contributing to fhEVM Playground Pro! 🎉
