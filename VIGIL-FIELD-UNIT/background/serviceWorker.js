// VIGIL BACKGROUND GUARDIAN
// VERSION: 0.0.3.5
// PERSISTENT_SECURITY_SERVICE

chrome.runtime.onInstalled.addListener(() => {
  console.log("[VIGIL] Persistent Guardian Layer 0.5 initialized.");
});

// Listening for security events from the Field Units
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'THREAT_DETECTED') {
    console.warn(`[VIGIL] Security Event: ${message.payload.verdict} in tab ${sender.tab.id}`);
  }
});