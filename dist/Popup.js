/******/ "use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/popup/UTPopupManager.js
class UTPopupManager {
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

;// CONCATENATED MODULE: ./src/popup/UTOption.js
class UTOption {
  // _port = null
  name = null
  value = null
  $element = null
  $label = null
  labels = null

  constructor (name, value, $element, $label, labels) {
    this.name = name
    this.value = value
    this.$element = $element
    this.$label = $label
    this.labels = labels
    this.value = value
    this._initOptionElement()
    this._computeLabel()
    this._initHandlers()
  }

  _initOptionElement () {
    this.$element.checked = this.value
  }

  _computeLabel () {
    this.$label.innerHTML = this._getLabel()
  }

  _initHandlers () {
    this.$element.addEventListener('click', () => {
      const extMessage = {
        scope: 'ut_option',
        name: 'enable',
        value: this.$element.checked,
      }
      chrome.runtime.sendMessage(chrome.runtime.id, extMessage, (_) => {
        this.value = this.$element.checked
        this._computeLabel()
      })
    })
  }

  _getLabel () {
    for (const label of this.labels) {
      if (label.value === this.value) {
        return label.text
      }
    }
    return null
  }
}

;// CONCATENATED MODULE: ./src/popup/popup.js



const port = chrome.runtime.connect(chrome.runtime.id)

const itemsLabels = {
  enable: [
    { value: true, text: 'Enabled', },
    { value: false, text: 'Disabled', },
  ],
}

const popup = new UTPopupManager()

window.addEventListener('DOMContentLoaded', () => {
  // Retrieve UT options from storage
  chrome.storage.sync.get('ut_options', (items) => {
    popup.setOptions(items.ut_options)
    // Init popup
    // -- Option: Enable
    const $optEnable = document.querySelector('[name="ut_option_enable"]')
    const $optEnableLabel = document.querySelector('.ut_option__row__text')
    const optEnableValue = popup.getOptionValue('enable')
    const utOption = new UTOption(
      'enable',
      optEnableValue,
      $optEnable,
      $optEnableLabel,
      itemsLabels.enable
    )
  })
})

console.log('[UT Popup] Ready.')

