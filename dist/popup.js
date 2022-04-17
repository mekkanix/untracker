/******/ "use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/popup/UTOption.js
class UTOption {
  name = null
  $element = null
  $label = null
  labels = null
  defaultValue = null
  
  constructor (name, $element, labels, defaultValue) {
    this.name = name
    this.$element = $element
    this.labels = labels
    this.defaultValue = defaultValue
    this._computeDefaultValue()
    this._initHandlers()
    this._initLabel()
  }

  _computeDefaultValue () {
    this.$element.checked = this.defaultValue
  }

  _initHandlers () {
    this.$element.addEventListener('click', () => {
      this.defaultValue = this.$element.checked
      this.$label.innerHTML = this._getLabel()
    })
  }

  _initLabel () {
    const $optionRowBox = this.$element.parentElement.children.item(1)
    const $optionText = $optionRowBox.children.item(1)
    this.$label = $optionText
    this.$label.innerHTML = this._getLabel()
  }

  _getLabel () {
    for (const label of this.labels) {
      if (label.value === this.defaultValue) {
        return label.text
      }
    }
    return null
  }
}
;// CONCATENATED MODULE: ./src/popup/UTLink.js
class UTLink {
  $element = null
  label = null
  
  constructor ($element, label) {
    this.$element = $element
    this.label = label
  }
}
;// CONCATENATED MODULE: ./src/popup/popup.js



const port = chrome.runtime.connect(
  chrome.runtime.id,
  { name: 'popup', }
)

const itemsLabels = {
  enable: [
    { value: true, text: 'Enabled', },
    { value: false, text: 'Disabled', },
  ],
}
const optionsDefaultValues = {
  enable: true,
}

window.addEventListener('DOMContentLoaded', () => {
  // Popup Options
  const $items = document.querySelectorAll('[data-ut-option]')
  $items.forEach($item => {
    const itemName = $item.getAttribute('data-ut-option')
    switch ($item.tagName) {
      case 'INPUT':
        const itemType = $item.getAttribute('type')
        const labels = itemsLabels[itemName]
        const defaultValue = optionsDefaultValues[itemName]
        switch (itemType) {
          case 'checkbox':
            const utOption = new UTOption(itemName, $item, labels, defaultValue)
            break
        }
        break
      case 'A':
        const label = itemsLabels[itemName]
        const utLink = new UTLink(itemName, $item, label)
        break
    }
  //     // chrome.runtime.sendMessage(
  //     //   chrome.runtime.id,
        
  //     // )
  })
})

