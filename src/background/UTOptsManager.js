export default class UTOptsManager {
  _storageName = null
  _optionsDefaults = {
    enable: true,
  }
  onReady = null

  constructor (storageName) {
    this._storageName = storageName
    this._initStorage()
      .then(() => {
        if (this.onReady && typeof this.onReady === 'function') {
          this.onReady()
        }
      })
  }

  _initStorage () {
    // Check for & create scoped (local) storage if needed
    return new Promise((resolve, _) => {
      chrome.storage.sync.get(this._storageName, (storage) => {
        const options = Object.entries(this._optionsDefaults)
        const newOpts = options.reduce((opts, [optName, optValue]) => {
          if (!storage.ut_options.hasOwnProperty(optName)) {
            opts[optName] = optValue
          }
          return opts
        }, {})
        if (Object.keys(newOpts).length) {
          const fmtNewOpts = {
            [this._storageName]: newOpts
          }
          chrome.storage.sync.set(fmtNewOpts, () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }

  updateOption (name, value) {
    return new Promise((resolve, reject) => {
      if (!this._optionsDefaults.hasOwnProperty(name)) {
        console.log('[UT Worker] Invalid option update requested. Aborted.')
        reject()
        return false
      }
      const fmtOpt = {
        [this._storageName]: { [name]: value }
      }
      chrome.storage.sync.set(fmtOpt, () => {
        resolve()
      })
      return true
    })
  }
}