// VIGIL CORE: ADDRESS DIFF ENGINE
// Heuristic Comparison Primitive

export function getAddressDiff(addr1, addr2) {
  if (!addr1 || !addr2) return [];
  const segments = [];
  const maxLen = Math.max(addr1.length, addr2.length);
  let i = 0;
  let current = { text: '', type: 'match' };

  while (i < maxLen) {
    const c1 = addr1[i] || '';
    const c2 = addr2[i] || '';
    const isMatch = c1 === c2 && c1 !== '';

    if (isMatch && current.type === 'match') current.text += c1;
    else if (!isMatch && current.type === 'diff') current.text += c1 || c2;
    else {
      if (current.text) segments.push(current);
      current = { text: c1 || c2, type: isMatch ? 'match' : 'diff' };
    }
    i++;
  }
  if (current.text) segments.push(current);
  return segments;
}