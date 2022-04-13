function LOG(...msg) {
  console.log('[UNTRACKER]', ...msg);
}

LOG('Ready');

const untracker = new Untracker()
const $links = document.querySelectorAll('a')
for (const $link of $links) {
  $link.addEventListener('click', function (e) {
    const linkUrl = $link.getAttribute('href')
    if (untracker.isTrackedURL(linkUrl)) {
      e.preventDefault()
      const formattedUrl = untracker.untrackURL(linkUrl)
      LOG(formattedUrl)
    }      
  })
}