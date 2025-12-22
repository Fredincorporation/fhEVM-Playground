/**
 * Templates Index
 * Central hub that imports all template parts and provides unified access
 * This file ties together all 24 category templates across 5 parts
 */
import * as part1 from './templates-part1';
import * as part2 from './templates-part2';
import * as part3 from './templates-part3';
import * as part4 from './templates-part4';
import * as part5 from './templates-part5';
// Re-export CATEGORIES from part 1
export { CATEGORIES } from './templates-part1';
/**
 * Get contract code for a category
 * Dispatches to the appropriate template part
 */
export function getContractTemplate(categoryName) {
    // Part 1 categories
    switch (categoryName) {
        case 'basic-counter':
            return part1.basicCounterContract();
        case 'arithmetic':
            return part1.arithmeticContract();
        case 'comparisons':
            return part1.comparisonsContract();
        // Part 2 categories
        case 'single-encryption':
            return part2.singleEncryptionContract();
        case 'multiple-encryption':
            return part2.multipleEncryptionContract();
        case 'single-decryption-user':
            return part2.singleDecryptionUserContract();
        case 'single-decryption-public':
            return part2.singleDecryptionPublicContract();
        case 'multiple-decryption':
            return part2.multipleDecryptionContract();
        // Part 3 categories
        case 'access-control':
            return part3.accessControlContract();
        case 'input-verification-proofs':
            return part3.inputVerificationProofsContract();
        case 'anti-patterns-guide':
            return part3.antiPatternsGuideContract();
        case 'handles-lifecycle':
            return part3.handlesLifecycleContract();
        // Part 4 categories
        case 'oz-erc20-wrapper':
            return part4.ozErc20WrapperContract();
        case 'oz-erc7984-basic':
            return part4.ozErc7984BasicContract();
        case 'swaps':
            return part4.swapsContract();
        case 'vesting':
            return part4.vestingContract();
        case 'blind-auction':
            return part4.blindAuctionContract();
        // Part 5 categories (PRO)
        case 'dao-voting-pro':
            return part5.daoVotingProContract();
        case 'private-lending-pro':
            return part5.privateLendingProContract();
        case 'blind-dex-pro':
            return part5.blindDexProContract();
        case 'poker-game-pro':
            return part5.pokerGameProContract();
        case 'yield-farming-pro':
            return part5.yieldFarmingProContract();
        case 'mev-arbitrage-pro':
            return part5.mevArbitrageProContract();
        case 'confidential-stablecoin-pro':
            return part5.confidentialStablecoinProContract();
        default:
            throw new Error(`Unknown category: ${categoryName}\`);
  }
}

/**
 * Get test code for a category
 */
export function getTestTemplate(categoryName: string): string {
  // Part 1 categories
  switch (categoryName) {
    case 'basic-counter':
      return part1.basicCounterTest();
    case 'arithmetic':
      return part1.arithmeticTest();
    case 'comparisons':
      return part1.comparisonsTest();
    
    // Part 2 categories
    case 'single-encryption':
      return part2.singleEncryptionTest();
    case 'multiple-encryption':
      return part2.multipleEncryptionTest();
    case 'single-decryption-user':
      return part2.singleDecryptionUserTest();
    case 'single-decryption-public':
      return part2.singleDecryptionPublicTest();
    case 'multiple-decryption':
      return part2.multipleDecryptionTest();
    
    // Part 3 categories
    case 'access-control':
      return part3.accessControlTest();
    case 'input-verification-proofs':
      return part3.inputVerificationProofsTest();
    case 'anti-patterns-guide':
      return part3.antiPatternsGuideTest();
    case 'handles-lifecycle':
      return part3.handlesLifecycleTest();
    
    // Part 4 categories
    case 'oz-erc20-wrapper':
      return part4.ozErc20WrapperTest();
    case 'oz-erc7984-basic':
      return part4.ozErc7984BasicTest();
    case 'swaps':
      return part4.swapsTest();
    case 'vesting':
      return part4.vestingTest();
    case 'blind-auction':
      return part4.blindAuctionTest();
    
    // Part 5 categories (PRO)
    case 'dao-voting-pro':
      return part5.daoVotingProTest();
    case 'private-lending-pro':
      return part5.privateLendingProTest();
    case 'blind-dex-pro':
      return part5.blindDexProTest();
    case 'poker-game-pro':
      return part5.pokerGameProTest();
    case 'yield-farming-pro':
      return part5.yieldFarmingProTest();
    case 'mev-arbitrage-pro':
      return part5.mevArbitrageProTest();
    case 'confidential-stablecoin-pro':
      return part5.confidentialStablecoinProTest();
    
    default:
      throw new Error(\`Unknown category: ${categoryName}\`);
  }
}

/**
 * Get README template for a category
 */
export function getReadmeTemplate(categoryName: string): string {
  const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ');
  
  return `, , $, { displayName }, , , Overview, This, is, a, reference, implementation, of, the ** $, { categoryName } ** example);
            for (fhEVM; Playground; Pro.
            )
                #;
            #;
            Features
                - FHE - encrypted;
            operations
                - Comprehensive;
            test;
            coverage
                - Gas - aware;
            implementations
                - Security;
            best;
            practices;
            #;
            #;
            Installation;
            `\`\`bash
npm install
\`\`\`

## Compilation

\`\`\`bash
npm run compile
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## Contract Details

See \`contracts/Contract.sol\` for implementation details.

## Security Considerations

- All sensitive data is encrypted
- Operations follow fhEVM best practices
- Comprehensive test suite validates correctness

## Gas Optimization

This example demonstrates gas-efficient patterns for encrypted operations.

## References

- [fhEVM Documentation](https://docs.zama.ai/fhevm)
- [TFHE.sol Reference](https://github.com/zama-ai/fhevm/tree/main/lib)
`;
    }
}
//# sourceMappingURL=templates-index.js.map