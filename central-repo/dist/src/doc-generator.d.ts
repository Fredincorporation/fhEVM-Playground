/**
 * Documentation Generator
 * Parses JSDoc comments from Solidity contracts and converts to Markdown
 * Generates GitBook-compatible documentation
 */
export interface DocBlock {
    name: string;
    description: string;
    params: Array<{
        name: string;
        type: string;
        description: string;
    }>;
    returns: {
        type: string;
        description: string;
    } | null;
    example?: string;
    deprecated?: boolean;
}
/**
 * Extract JSDoc blocks from Solidity code
 */
export declare function extractJSDocBlocks(solidityCode: string): DocBlock[];
/**
 * Convert doc blocks to Markdown
 */
export declare function docBlocksToMarkdown(blocks: DocBlock[]): string;
/**
 * Generate complete README from contract
 */
export declare function generateContractMarkdown(contractName: string, solidityCode: string, categoryDescription?: string): string;
/**
 * Generate README for entire project
 */
export declare function generateProjectReadme(projectName: string, category: string, contractNames: string[]): string;
/**
 * Generate summary for category
 */
export declare function generateCategorySummary(categoryData: any): string;
//# sourceMappingURL=doc-generator.d.ts.map