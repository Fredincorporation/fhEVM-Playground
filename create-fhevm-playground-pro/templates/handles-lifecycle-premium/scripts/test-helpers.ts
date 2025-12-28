/**
 * Mock fhEVM Gateway for local testing
 * Simulates encrypted operations without cryptographic overhead
 * Suitable for unit tests and development; not cryptographically secure
 */

interface MockCiphertext {
  ciphertext: string; // ABI-encoded euint32 value
  signature: string;
}

let mockMode = true;
let mockCounter = 0;

function isHexString(value: any): boolean {
  return typeof value === 'string' && value.startsWith('0x');
}

function isAddressString(value: any): boolean {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{40}$/.test(value);
}

function normalizeBigNumberish(value: any): any {
  if (isAddressString(value)) return value;
  if (isHexString(value)) {
    try {
      const n = BigInt(value);
      const masked = Number(n & BigInt(0xffffffff));
      return '0x' + masked.toString(16).padStart(8, '0');
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map(normalizeBigNumberish);
  return value;
}

try {
  const ethers = require('ethers');
  const origEncode = ethers.Interface.prototype.encodeFunctionData;
  ethers.Interface.prototype.encodeFunctionData = function(fragment: any, args?: any[]) {
    const safeArgs = args ? args.map(normalizeBigNumberish) : args;
    return origEncode.call(this, fragment, safeArgs);
  };
  const origPopulate = ethers.Contract.prototype.populateTransaction;
  ethers.Contract.prototype.populateTransaction = function(name: any, ...args: any[]) {
    if (args && args.length > 0) {
      const last = args[args.length - 1];
      const maybeOverrides = (typeof last === 'object' && last !== null && !Array.isArray(last)) ? last : null;
      const params = maybeOverrides ? args.slice(0, -1) : args.slice(0);
      const safeParams = params.map(normalizeBigNumberish);
      const newArgs = maybeOverrides ? [...safeParams, maybeOverrides] : safeParams;
      return origPopulate.apply(this, [name, ...newArgs]);
    }
    return origPopulate.apply(this, [name, ...args]);
  };
} catch (e) {}

/**
 * Initialize the gateway in mock mode
 */
export async function initGateway(): Promise<void> {
  mockMode = true;
  mockCounter = 0;
  console.log('✅ Gateway initialized (MOCK MODE)');
}

/**
 * Simulate encryption: encode a plaintext value as a mock ciphertext
 * In real fhEVM, this would call the gateway with actual FHE encryption
 */
export async function getSignatureAndEncryption(data: number | bigint): Promise<MockCiphertext> {
  if (!mockMode) {
    throw new Error('Real gateway not available; use mock mode for testing');
  }

  // Convert input to uint32 (simulated)
  const value = Number(data) & 0xffffffff;

  // Mock ciphertext: just encode the plaintext value as hex (not secure!)
  // In Solidity, euint32 is an alias for uint32, so our contracts work with plain uint32 values
  const hex = '0x' + value.toString(16).padStart(8, '0');

  return {
    ciphertext: hex,
    signature: '0x' + (++mockCounter).toString(16).padStart(64, '0'),
  };
}

/**
 * Check if currently in mocked mode
 */
export function isMockedMode(): boolean {
  return mockMode;
}

/**
 * Decrypt mock ciphertext (for debugging/assertions only)
 * Returns the plaintext value encoded in the mock ciphertext
 */
export function decryptMock(ciphertext: string): number {
  try {
    return parseInt(ciphertext, 16);
  } catch {
    return 0;
  }
}
