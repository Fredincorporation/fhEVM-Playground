/**
 * Mock fhEVM Gateway for local testing
 * Simulates encrypted operations without cryptographic overhead
 * Suitable for unit tests and development; not cryptographically secure
 */

let mockMode = true;
let mockCounter = 0;

/**
 * Initialize the gateway in mock mode
 */
async function initGateway() {
  mockMode = true;
  mockCounter = 0;
  console.log('✅ Gateway initialized (MOCK MODE - suitable for testing only)');
}

/**
 * Simulate encryption: encode a plaintext value as a mock ciphertext
 * In real fhEVM, this would call the gateway with actual FHE encryption
 */
async function getSignatureAndEncryption(data) {
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
function isMockedMode() {
  return mockMode;
}

/**
 * Decrypt mock ciphertext (for debugging/assertions only)
 * Returns the plaintext value encoded in the mock ciphertext
 */
function decryptMock(ciphertext) {
  try {
    return parseInt(ciphertext, 16);
  } catch {
    return 0;
  }
}

module.exports = {
  initGateway,
  getSignatureAndEncryption,
  isMockedMode,
  decryptMock
};
