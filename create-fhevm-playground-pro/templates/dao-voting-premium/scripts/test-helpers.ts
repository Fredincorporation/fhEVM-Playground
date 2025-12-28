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
  const hex = '0x' + value.toString(16).padStart(64, '0');

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
