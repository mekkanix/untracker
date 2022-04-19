import UTContentManager from './UTContentManager.js'

// Retrieve UT options from storage
chrome.storage.sync.get(null, (items) => {
  const enabled = items.ut_options.enable
  const utContentManager = new UTContentManager(enabled)
  utContentManager.start()

  console.log('[UT Content] Ready.')
})
