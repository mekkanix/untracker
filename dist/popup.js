var __webpack_exports__ = {};
const port = chrome.runtime.connect(
  chrome.runtime.id,
  { name: 'popup', }
)

window.addEventListener('DOMContentLoaded', function () {
  // Popup Settings
  const $settings = document.querySelectorAll('[data-ut-settings-item]')
  $settings.forEach(element => {
    element.addEventListener('click', function (e) {
      console.log(e, chrome);
    })
  })
})
