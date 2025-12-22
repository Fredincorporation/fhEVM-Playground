export interface ScaffoldOptions {
    name: string;
    category: string;
    isPro: boolean;
}
/**
 * Main scaffolding function
 * Creates a new fhEVM example project with all necessary files and structure
 */
export declare function createExample(options: ScaffoldOptions): Promise<void>;
//# sourceMappingURL=scaffolder.d.ts.map