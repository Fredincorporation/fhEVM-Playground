export function initGateway() {
  return Promise.resolve({ gateway: 'stub' });
}

export function getSignatureAndEncryption(value?: number) {
  // Return an object matching the shape expected by tests
  return {
    ciphertext: value !== undefined ? `0x${value.toString(16).padStart(8, '0')}` : '0x0',
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

export function normalizeBigNumberish(v: string | number | bigint): string {
  if (typeof v === 'number' || typeof v === 'bigint') {
    const bn = BigInt(v);
    // Mask to uint32
    return '0x' + (bn & BigInt('0xffffffff')).toString(16).padStart(8, '0');
  }
  if (typeof v !== 'string') return '0x0';
  
  // Handle the "0x...-N" pattern (wrap-around values)
  const m = v.match(/^(0x[0-9a-fA-F]+)-(\d+)$/);
  if (m) {
    const hex = m[1];
    const dec = BigInt(m[2]);
    const raw = BigInt(hex);
    const width = BigInt((hex.length - 2) * 4);
    const mod = 1n << width;
    let res = raw - dec;
    if (res < 0) res += mod;
    const hexDigits = hex.length - 2;
    let out = res.toString(16).padStart(hexDigits, '0');
    // Still mask the result to uint32 for parameter encoding
    const masked = BigInt('0x' + out) & BigInt('0xffffffff');
    return '0x' + masked.toString(16).padStart(8, '0');
  }
  
  // Regular hex string: if it looks like an encrypted value (>32 chars after 0x),
  // treat it as needing masking to uint32
  if (v.startsWith('0x')) {
    const hexPart = v.slice(2);
    if (hexPart.length > 8) {
      // Encrypted value or large number, mask to uint32
      const bn = BigInt(v);
      return '0x' + (bn & BigInt('0xffffffff')).toString(16).padStart(8, '0');
    }
  }
  
  return v;
}

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
