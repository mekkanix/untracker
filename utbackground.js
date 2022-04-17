import OptionManager from './src/background/OptionManager.js'

const optManager = new OptionManager()

// Hook: installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Untracker][worker] Ready.')
})

// Hook: connect
chrome.runtime.onConnect.addListener(port => {
  // switch (port.name) {
    
  // }
})

// Hook: message
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  switch (data.scope) {
    case 'ut_option':
      console.log(`[Untracker][worker] Updating option: [${data.name}: ${data.value}]`)
      optManager.updateOption(data.name, data.value)
  }
  sendResponse('OK')
})