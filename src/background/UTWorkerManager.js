import UTOptsManager from './UTOptsManager.js'

export default class UTWorkerManager {
  _storageNames = [
    'ut_options'
  ]
  optsManager = null
  onReady = null

  constructor () {
    // chrome.storage.sync.clear()
    this._initStorage()
      .then(() => {
        this.optsManager = new UTOptsManager(this._storageNames[0])
        this.optsManager.onReady = () => {
          // this._initBaseHooks()
          chrome.storage.sync.get(null, storages => {
            console.log('[UT Worker] Current storage:', storages);
          })
        }
        console.log('[UT Worker] Ready.');
        if (this.onReady && typeof this.onReady === 'function') {
          this.onReady()
        }
      })
  }

  _initStorage () {
    // Check for & create main storages if needed
    return new Promise((resolve, _) => {
      chrome.storage.sync.get(this._storageNames, (item) => {
        const newStorages = this._storageNames.reduce((stgs, stgName) => {
          if (!item[stgName]) {
            stgs[stgName] = {}
          }
          return stgs
        }, {})
        if (Object.keys(newStorages).length) {
          chrome.storage.sync.set(newStorages, () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }

  _initBaseHooks () {
    // Base hook: installed
    // chrome.runtime.onInstalled.addListener(() => {
    //   console.log('[UT Worker] Ready.')
    // })
  }

  _initHooks () {
    // Hook: connect
    chrome.runtime.onConnect.addListener(port => {
      // console.log(port);
    })

    // Hook: message
    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
      switch (data.scope) {
        case 'ut_option':
          console.log(`[UT Worker] Option update requested: [${data.name}: ${data.value}]`)
          this.optsManager.updateOption(data.name, data.value)
            .then(() => {
              chrome.storage.sync.get(null, storages => {
                console.log('[UT Worker] Updated storage:', storages);
              })
            })
      }
      sendResponse('OK')
    })
  }

  start () {
    this._initHooks()
  }
}