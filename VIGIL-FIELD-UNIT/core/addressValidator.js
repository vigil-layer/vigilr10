// VIGIL CORE: ADDRESS VALIDATOR
// Mathematical Primitive

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function isValidSolanaAddress(address) {
  if (!address || typeof address !== 'string') return false;
  if (address.length < 32 || address.length > 44) return false;
  for (let i = 0; i < address.length; i++) {
    if (!BASE58_ALPHABET.includes(address[i])) return false;
  }
  return true;
}

export function extractAddresses(text) {
  if (!text || typeof text !== 'string') return [];
  const regex = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
  return (text.match(regex) || []).filter(isValidSolanaAddress);
}