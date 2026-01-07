// VIGIL DASHBOARD CONTROLLER
// VERSION: 0.0.3.5

async function updateDashboard() {
  const data = await chrome.storage.local.get(['VIG_USER_BRI']);
  const bri = data.VIG_USER_BRI !== undefined ? data.VIG_USER_BRI : 100;
  
  const valEl = document.getElementById('bri-val');
  const fillEl = document.getElementById('bri-fill');
  
  if (valEl) valEl.innerText = `${bri}%`;
  if (fillEl) {
    fillEl.style.width = `${bri}%`;
    fillEl.style.backgroundColor = bri > 80 ? '#10b981' : bri > 40 ? '#f59e0b' : '#ef4444';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
  setInterval(updateDashboard, 1000);
  console.log("[VIGIL] Dashboard active.");
});