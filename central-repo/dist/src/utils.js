/**
 * Utility functions for fhEVM Playground Pro CLI
 */
/**
 * Validate project name
 */
export function ensureValidProjectName(name) {
    if (!name || name.length === 0)
        return false;
    if (!/^[a-zA-Z0-9_-]+$/.test(name))
        return false;
    if (name.length > 100)
        return false;
    return true;
}
/**
 * Convert string to PascalCase
 */
export function toPascalCase(str) {
    return str
        .toLowerCase()
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
/**
 * Convert string to camelCase
 */
export function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
/**
 * Get contract class name from category
 */
export function getContractClassName(categoryName) {
    return toPascalCase(categoryName);
}
/**
 * Get test class name from category
 */
export function getTestClassName(categoryName) {
    return toPascalCase(categoryName) + 'Test';
}
//# sourceMappingURL=utils.js.map