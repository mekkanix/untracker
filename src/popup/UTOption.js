export default class UTOption {
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