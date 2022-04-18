import UTContentManager from './UTContentManager.js'

// Retrieve UT options from storage
chrome.storage.sync.get(null, (items) => {
  const enabled = items.ut_options.enable
  const utContentManager = new UTContentManager()
  if (enabled) {
    utContentManager.watch()
  }
})
// const untracker = new Untracker()
// const $links = document.querySelectorAll('a')
// for (const $link of $links) {
//   $link.addEventListener('click', function (e) {
//     const linkUrl = $link.getAttribute('href')
//     if (untracker.isTrackedURL(linkUrl)) {
//       e.preventDefault()
//       const formattedUrl = untracker.untrackURL(linkUrl)
//       const linkTarget = $link.getAttribute('target')
//       if (linkTarget === '_blank') {
//         window.open(formattedUrl)
//       } else {
//         window.location.href = formattedUrl
//       }
//     }      
//   })
// }