export function ensureValidProjectName(name) {
  if (!name || typeof name !== 'string') return false;
  // Allow letters, numbers, hyphens and underscores
  return /^[A-Za-z0-9_-]+$/.test(name);
}

export function toPascalCase(s) {
  return String(s)
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

export function toCamelCase(s) {
  const pascal = toPascalCase(s);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function getContractClassName(name) {
  return toPascalCase(name.replace(/[-_\s]+/g, '-'));
}

export function getTestClassName(name) {
  return getContractClassName(name) + 'Test';
}
