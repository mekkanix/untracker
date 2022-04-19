export default class UTPopupManager {
  _options = null

  constructor () {

  }

  setOptions (options) {
    this._options = options
  }

  getOptionValue (name) {
    for (const [optName, optValue] of Object.entries(this._options)) {
      if (optName === name) {
        return optValue
      }
    }
    return null
  }

  // Utility methods -------------------------

  isUTEnabled () {
    return this._options.enable
  }
}
