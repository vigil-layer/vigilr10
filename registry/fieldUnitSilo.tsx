import React from 'react';
import { FileJson, FileCode, FileText } from 'lucide-react';

export interface ManifestFile {
  path: string;
  icon: React.ReactNode;
  type: string;
  content: string;
}

export const SILO_MANIFEST: ManifestFile[] = [
  {
    path: 'manifest.json',
    icon: <FileJson size={14} />,
    type: 'VIG-MANIFEST-v3',
    content: `{
  "manifest_version": 3,
  "name": "VIGIL | Field Unit",
  "version": "0.0.4.5",
  "description": "Layer 0.5 Security Standard. Modular HUD Architecture v2.",
  "permissions": ["storage", "scripting"],
  "host_permissions": ["<all_urls>"],
  "action": { "default_popup": "popup/popup.html" },
  "background": { "service_worker": "background/serviceWorker.js", "type": "module" },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/retinalShield.js"],
      "run_at": "document_start"
    }
  ]
}`
  },
  {
    path: 'background/serviceWorker.js',
    icon: <FileCode size={14} />,
    type: 'JS_SERVICE_WORKER',
    content: `chrome.runtime.onInstalled.addListener(() => {
  console.log("[VIGIL] Persistent Guardian Layer 0.5 initialized.");
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'THREAT_DETECTED') {
    console.warn(\`[VIGIL] Security Event: \${message.payload.verdict} in tab \${sender.tab.id}\`);
  }
});`
  },
  {
    path: 'content/retinalShield.js',
    icon: <FileCode size={14} />,
    type: 'JS_TACTICAL_DISPATCHER',
    content: `(async function() {
  const validatorSrc = chrome.runtime.getURL('core/addressValidator.js');
  const indexerSrc = chrome.runtime.getURL('core/threatIndex.js');
  
  const { isValidSolanaAddress } = await import(validatorSrc);
  const { calculateCompositeThreat, getAxesFromVerdict } = await import(indexerSrc);

  const TRUSTED_NODES = ['Ab1C92kLp6mX9wR7yT5vB4nQ8jK3mZz90'];

  async function analyzeAddress(addr) {
    if (TRUSTED_NODES.includes(addr)) return 'TRUSTED';
    const collision = TRUSTED_NODES.find(t => addr.slice(0, 4) === t.slice(0, 4) && addr.slice(-4) === t.slice(-4));
    if (collision) return 'POISON';
    return 'NEW';
  }

  document.addEventListener('paste', async (e) => {
    const text = e.clipboardData.getData('text').trim();
    if (isValidSolanaAddress(text)) {
      const verdict = await analyzeAddress(text);
      console.log(\`[VIGIL] \${verdict} address detected.\`);
    }
  }, true);
})();`
  },
  {
    path: 'core/threatIndex.js',
    icon: <FileCode size={14} />,
    type: 'JS_COMPOSITE_ENGINE',
    content: `export function calculateCompositeThreat(axes) {
  if (axes.rii === 100 || axes.eii === 100) return 100;
  const score = (
    (axes.vsi || 0) * 0.20 + (axes.edi || 0) * 0.15 + (axes.pdi || 0) * 0.15 +
    (axes.cri || 0) * 0.15 + (axes.ipi || 0) * 0.15 + (axes.rii || 0) * 0.10 + (axes.eii || 0) * 0.10
  );
  return Math.round(Math.min(100, score));
}

export function getAxesFromVerdict(verdict) {
  const presets = {
    POISON: { vsi: 95, edi: 90, pdi: 50, cri: 30, ipi: 80, rii: 0, eii: 0 },
    NEW: { vsi: 10, edi: 0, pdi: 100, cri: 30, ipi: 10, rii: 0, eii: 0 },
    TRUSTED: { vsi: 5, edi: 0, pdi: 10, cri: 0, ipi: 0, rii: 0, eii: 0 }
  };
  return presets[verdict] || presets.NEW;
}`
  }
];