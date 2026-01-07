// VIGIL HUD: ALERT_NEW
// MODULE_ID: VIG-HUD-NEW

export function render(address, index) {
  const host = document.createElement('div');
  host.id = 'vigil-hud-root';
  host.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;';
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      @keyframes pulse { 0%, 100% { border-color: #06b6d444; } 50% { border-color: #06b6d4; } }
      .backdrop { position: fixed; inset: 0; background: rgba(0, 2, 2, 0.95); backdrop-filter: blur(25px); opacity: 0; transition: opacity 0.4s ease; pointer-events: auto; display: flex; align-items: center; justify-content: center; font-family: system-ui, -apple-system, sans-serif; }
      .backdrop.active { opacity: 1; }
      .card { width: 440px; background: #000505; border: 2px solid #06b6d4; border-radius: 32px; padding: 40px; color: white; position: relative; overflow: hidden; animation: pulse 4s infinite; }
      .header { display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #001a1a; padding-bottom: 24px; margin-bottom: 24px; }
      .addr { background: #000a0a; border: 1px solid #033; padding: 20px; border-radius: 16px; font-family: monospace; font-size: 12px; color: #06b6d4; word-break: break-all; margin-bottom: 24px; }
      .btn { width: 100%; padding: 18px; border-radius: 16px; font-weight: 900; text-transform: uppercase; cursor: pointer; border: none; font-size: 11px; margin-bottom: 12px; }
      .btn-primary { background: #06b6d4; color: #000; }
      .btn-secondary { background: #000; color: #444; border: 1px solid #222; }
    </style>
    <div class="backdrop" id="b">
      <div class="card">
        <div class="header">
          <div style="font-size: 32px;">👤</div>
          <div><div style="color:#06b6d4; font-weight:900; font-style:italic; font-size: 18px;">REPORT: NEW ADDRESS</div><div style="font-size:8px; color:#055; letter-spacing:0.3em;">VIGIL_FIELD_UNIT // v0.0.4.0</div></div>
        </div>
        <div class="addr">${address}</div>
        <p style="font-size: 13px; color: #999; font-style: italic; margin-bottom: 24px;">Forensic alert: This node has no prior interaction history. Unknown provenance detected in local trust graph.</p>
        <button class="btn btn-primary" id="c">INITIATE FORENSIC SCAN</button>
        <button class="btn btn-secondary" id="o">PROCEED WITH CAUTION</button>
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
  shadow.getElementById('o').onclick = close;
}