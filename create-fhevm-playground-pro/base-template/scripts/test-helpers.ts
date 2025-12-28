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
  const hexDigits = hex.length - 2;
  let out = res.toString(16).padStart(hexDigits, '0');
  return '0x' + out;
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
