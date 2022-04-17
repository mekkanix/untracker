const port = chrome.runtime.connect(
  chrome.runtime.id,
  { name: 'popup', }
)

const optionsMap = {
  enable: {

  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Popup Options
  const $options = document.querySelectorAll('[data-ut-option]')
  $options.forEach($option => {
    $option.addEventListener('click', (e) => {
      if ($option.tagName) {
        
      }
    })
  //     const value = $settingsBtn.getAttribute('data-ut-settings-value')
  //     const fmtValue = JSON.parse(value)
  //     // chrome.runtime.sendMessage(
  //     //   chrome.runtime.id,
        
  //     // )
  })
})