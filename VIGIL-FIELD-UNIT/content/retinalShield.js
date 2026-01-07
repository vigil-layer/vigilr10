// VIGIL FIELD UNIT: TACTICAL DISPATCHER
// VERSION: 0.0.4.5
// COMPONENT: CONTENT_DISPATCHER

(async function() {
  const validatorSrc = chrome.runtime.getURL('core/addressValidator.js');
  const indexerSrc = chrome.runtime.getURL('core/threatIndex.js');
  
  const { isValidSolanaAddress } = await import(validatorSrc);
  const { calculateCompositeThreat, getAxesFromVerdict } = await import(indexerSrc);

  const TRUSTED_NODES = [
    'Ab1C92kLp6mX9wR7yT5vB4nQ8jK3mZz90',
    'EPjFW33rdLH2QD6LksXY33vMRfGct1grTparXMQ7fgc3',
    'Vig1L1iG1iG1iG1iG1iG1iG1iG1iG1iG1iG1iG1iG1i'
  ];

  async function analyzeAddress(addr) {
    const data = await chrome.storage.local.get(['VIG_USER_TRUSTED_NODES']);
    const userWhiteslist = data.VIG_USER_TRUSTED_NODES || [];
    
    if (TRUSTED_NODES.includes(addr) || userWhiteslist.includes(addr)) return 'TRUSTED';
    const collision = TRUSTED_NODES.find(t => addr.slice(0, 4) === t.slice(0, 4) && addr.slice(-4) === t.slice(-4));
    if (collision) return 'POISON';
    if (/(.)\1{5,}/.test(addr)) return 'SPOOF';
    if (addr.toUpperCase().startsWith('DEFI') || addr.toUpperCase().startsWith('CEX')) return 'SIMILARITY';
    return 'NEW';
  }

  async function dispatchHUD(address) {
    if (document.getElementById('vigil-hud-root')) return;

    const verdict = await analyzeAddress(address);
    const axes = getAxesFromVerdict(verdict);
    const index = calculateCompositeThreat(axes);

    // DYNAMIC IMPORT OF MODULAR HUD
    const moduleName = `Alert${verdict.charAt(0) + verdict.slice(1).toLowerCase()}.js`;
    const moduleSrc = chrome.runtime.getURL(`content/ui/${moduleName}`);
    
    try {
      const { render } = await import(moduleSrc);
      render(address, index);
    } catch (e) {
      console.error(`[VIGIL] Failed to dispatch HUD module: ${moduleName}`, e);
    }
  }

  document.addEventListener('paste', (e) => {
    const text = e.clipboardData.getData('text').trim();
    if (isValidSolanaAddress(text)) {
      dispatchHUD(text);
    }
  }, true);

  console.log("[VIGIL] Tactical Dispatcher v0.0.4.5 active.");
})();