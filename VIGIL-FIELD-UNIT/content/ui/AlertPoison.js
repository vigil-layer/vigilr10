// VIGIL HUD: ALERT_POISON
// MODULE_ID: VIG-HUD-POI

export function render(address, index) {
  const host = document.createElement('div');
  host.id = 'vigil-hud-root';
  host.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;';
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
      .backdrop { position: fixed; inset: 0; background: rgba(2, 0, 0, 0.96); backdrop-filter: blur(30px); opacity: 0; transition: opacity 0.4s ease; pointer-events: auto; display: flex; align-items: center; justify-content: center; font-family: system-ui, -apple-system, sans-serif; }
      .backdrop.active { opacity: 1; }
      .card { width: 440px; background: #050000; border: 2px solid #ef4444; border-radius: 32px; padding: 40px; color: white; position: relative; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,1); }
      .threat-badge { position: absolute; top: 32px; right: 32px; padding: 4px 12px; background: #000; border: 1px solid #ef444444; border-radius: 100px; font-weight: 900; font-style: italic; color: #ef4444; font-size: 14px; }
      .header { display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #1a0000; padding-bottom: 24px; margin-bottom: 24px; }
      .addr { background: #0a0000; border: 1px solid #300; padding: 20px; border-radius: 16px; font-family: monospace; font-size: 12px; color: #ef4444; word-break: break-all; margin-bottom: 24px; }
      .btn { width: 100%; padding: 18px; border-radius: 16px; font-weight: 900; text-transform: uppercase; cursor: pointer; border: none; font-size: 11px; margin-bottom: 12px; }
      .btn-primary { background: #ef4444; color: #000; }
      .btn-secondary { background: #000; color: #444; border: 1px solid #222; }
      .scan-line { position: absolute; left: 0; width: 100%; height: 2px; background: #ef4444; box-shadow: 0 0 20px #ef4444; animation: scan 4s linear infinite; opacity: 0.3; }
    </style>
    <div class="backdrop" id="b">
      <div class="card">
        <div class="scan-line"></div>
        <div class="threat-badge">${index}%</div>
        <div class="header">
          <div style="font-size: 32px;">💀</div>
          <div><div style="color:#ef4444; font-weight:900; font-style:italic; font-size: 18px;">POISONING DETECTED</div><div style="font-size:8px; color:#600; letter-spacing:0.3em;">VIGIL_FIELD_UNIT // v0.0.4.0</div></div>
        </div>
        <div class="addr">${address}</div>
        <p style="font-size: 13px; color: #999; font-style: italic; margin-bottom: 24px;">Critical mimicry attack identified. The address edges share high similarity with a trusted node, but entropy deviates in the core.</p>
        <button class="btn btn-primary" id="c">HALT: INCINERATE PAYLOAD</button>
        <button class="btn btn-secondary" id="o">OVERRIDE: IGNORE RISK</button>
      </div>
    </div>
  `;

  document.documentElement.appendChild(host);
  setTimeout(() => shadow.getElementById('b').classList.add('active'), 10);
  
  const close = () => {
    shadow.getElementById('b').classList.remove('active');
    setTimeout(() => host.remove(), 400);
  };

  shadow.getElementById('c').onclick = close;
  shadow.getElementById('o').onclick = () => {
    chrome.storage.local.get(['VIG_USER_BRI'], (d) => {
      const bri = d.VIG_USER_BRI || 100;
      chrome.storage.local.set({ 'VIG_USER_BRI': Math.max(0, bri - 15) });
    });
    close();
  };
}