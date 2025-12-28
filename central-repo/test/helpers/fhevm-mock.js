const FhevmType = {
  euint32: 0,
};

function createEncryptedInput(_contractAddress, _signer) {
  let value = 0;
  return {
    add32(n) {
      value = Number(n);
      return this;
    },
    async encrypt() {
      // Return handles as raw numeric values and a dummy proof
      return { handles: [value], inputProof: '0x' };
    },
  };
}

function userDecryptEuint(type, encrypted, _contractAddress, _signer) {
  // encrypted may be a hex string (bytes32) or a numeric value
  if (typeof encrypted === 'string' && encrypted.startsWith('0x')) {
    return Number(BigInt(encrypted));
  }
  return Number(encrypted);
}

export default {
  isMock: true,
  createEncryptedInput,
  userDecryptEuint,
  FhevmType,
};
