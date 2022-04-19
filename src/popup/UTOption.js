export default class UTOption {
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
