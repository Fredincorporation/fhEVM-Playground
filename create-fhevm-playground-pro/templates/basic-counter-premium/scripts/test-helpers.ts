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
    // accept strings like '0x...-N' produced by TFHE shim; normalize first
    const norm = normalizeBigNumberish(ciphertext);
    return Number(BigInt(norm));
  } catch {
    return 0;
  }
}

/**
 * Normalize BigNumberish-like strings that may have a trailing "-N" suffix
 * (e.g. produced by TFHE shim). Returns a hex string representing the
 * unsigned wrap-around value suitable for ethers encoding, or the numeric
 * value as a string when appropriate.
 */
export function normalizeBigNumberish(v: string | number | bigint): string {
  if (typeof v === 'number' || typeof v === 'bigint') {
    return '0x' + BigInt(v).toString(16);
  }
  if (typeof v !== 'string') return '0x0';

  const m = v.match(/^(0x[0-9a-fA-F]+)-(\d+)$/);
  if (!m) return v;

  const hex = m[1];
  const dec = BigInt(m[2]);
  const raw = BigInt(hex);
  const width = BigInt((hex.length - 2) * 4);
  const mod = 1n << width;
  let res = raw - dec;
  if (res < 0) res += mod;
  // pad to original width
  const hexDigits = hex.length - 2;
  let out = res.toString(16).padStart(hexDigits, '0');
  return '0x' + out;
}

/**
 * Safely convert receipt.gasUsed (which may be BigNumber-like) to number
 */
export function toNumberSafe(v: any): number {
  try {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'bigint') return Number(v);
    if (typeof v === 'string') return Number(v);
    if (typeof v.toNumber === 'function') return v.toNumber();
    if (typeof v.toNumber === 'undefined' && typeof v._hex === 'string') {
      return Number(BigInt(v._hex));
    }
    if (typeof v.toString === 'function') return Number(v.toString());
    return 0;
  } catch {
    return 0;
  }
}
