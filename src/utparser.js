import Untracker from './Untracker.js'

const untracker = new Untracker()
const $links = document.querySelectorAll('a')
for (const $link of $links) {
  $link.addEventListener('click', function (e) {
    const linkUrl = $link.getAttribute('href')
    if (untracker.isTrackedURL(linkUrl)) {
      e.preventDefault()
      const formattedUrl = untracker.untrackURL(linkUrl)
      const linkTarget = $link.getAttribute('target')
      if (linkTarget === '_blank') {
        window.open(formattedUrl)
      } else {
        window.location.href = formattedUrl
      }
    }      
  })
}