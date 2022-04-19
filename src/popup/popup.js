import UTPopupManager from './UTPopupManager.js'
import UTOption from './UTOption.js'

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
