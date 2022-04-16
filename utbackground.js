// Hook: onInstalled
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Untracker] Background script: OK.');
})

// Hook: onConnect
chrome.runtime.onConnect.addListener(port => {
  switch (port.name) {
    case 'popup':
      break
  }
})