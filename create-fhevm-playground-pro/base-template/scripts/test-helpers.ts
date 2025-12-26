export function initGateway() {
  return Promise.resolve({ gateway: 'stub' });
}

export function getSignatureAndEncryption(value?: number) {
  // Return an object matching the shape expected by tests
  return {
    ciphertext: value !== undefined ? `0x${value.toString(16).padStart(64, '0')}` : '0x0',
    signature: '0x' + '00'.repeat(32),
    encryption: '0x' + '00'.repeat(32),
  };
}

export function isMockedMode() {
  return true;
}

export default {
  initGateway,
  getSignatureAndEncryption,
  isMockedMode,
};
