// VIGIL CORE: THREAT MATRIX CALCULATION ENGINE
// VERSION: 1.0.7
// AXIS WEIGHTS: VSI(0.20), EDI(0.15), PDI(0.15), CRI(0.15), IPI(0.15), RII(0.10), EII(0.10)

/**
 * Calculates the composite threat index (0-100%)
 */
export function calculateCompositeThreat(axes) {
  // CRITICAL OVERRIDES: Registry or Execution failures trigger 100% immediate threat
  if (axes.rii === 100 || axes.eii === 100) return 100;

  const score = (
    (axes.vsi || 0) * 0.20 +
    (axes.edi || 0) * 0.15 +
    (axes.pdi || 0) * 0.15 +
    (axes.cri || 0) * 0.15 +
    (axes.ipi || 0) * 0.15 +
    (axes.rii || 0) * 0.10 +
    (axes.eii || 0) * 0.10
  );

  return Math.round(Math.min(100, score));
}

/**
 * Generates axis scores for simulation or legacy rendering
 */
export function getAxesFromVerdict(verdict) {
  const presets = {
    POISON: { vsi: 95, edi: 90, pdi: 50, cri: 30, ipi: 80, rii: 0, eii: 0 },
    SPOOF: { vsi: 100, edi: 95, pdi: 100, cri: 40, ipi: 10, rii: 0, eii: 0 },
    SIMILARITY: { vsi: 85, edi: 60, pdi: 30, cri: 30, ipi: 10, rii: 0, eii: 0 },
    NEW: { vsi: 10, edi: 0, pdi: 100, cri: 30, ipi: 10, rii: 0, eii: 0 },
    TRUSTED: { vsi: 5, edi: 0, pdi: 10, cri: 0, ipi: 0, rii: 0, eii: 0 }
  };
  return presets[verdict] || presets.NEW;
}