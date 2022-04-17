import UTOption from "./UTOption.js"
import UTLink from "./UTLink.js"

const port = chrome.runtime.connect(chrome.runtime.id)

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
  })
})

console.log('[Untracker][popup] Ready.')
