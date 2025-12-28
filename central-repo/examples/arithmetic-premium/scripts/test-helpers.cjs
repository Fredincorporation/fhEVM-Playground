let mockMode = true;
let mockCounter = 0;

async function initGateway() {
  mockMode = true;
  mockCounter = 0;
  console.log('✅ Gateway initialized (MOCK MODE)');
}

async function getSignatureAndEncryption(data) {
  if (!mockMode) {
    throw new Error('Real gateway not available; use mock mode for testing');
  }
  const value = Number(data) & 0xffffffff;
  const hex = '0x' + value.toString(16).padStart(64, '0');
  return {
    ciphertext: hex,
    signature: '0x' + (++mockCounter).toString(16).padStart(64, '0'),
  };
}

function isMockedMode() {
  return mockMode;
}

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
