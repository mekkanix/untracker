import UTQueryManager from './UTQueryManager.js'

export default class UTContentManager {
  _queryManager = null
  _links = []

  constructor () {
    this._queryManager = new UTQueryManager()
    this._parseLinks()
  }

  _parseLinks () {
    const $links = document.querySelectorAll('a')
    for (const $link of $links) {
      this._links.push({
        $element: $link,
        onClick: (e) => {
          // wrapping handler here because we need one extra argument ($link) 
          this._onLinkClick(e, $link)
        },
      })
    }
  }

  _onLinkClick (e, $link) {
    const linkUrl = $link.getAttribute('href')
    if (this._queryManager.isTrackedURL(linkUrl)) {
      e.preventDefault()
      const formattedUrl = this._queryManager.untrackURL(linkUrl)
      const linkTarget = $link.getAttribute('target')
      if (linkTarget === '_blank') {
        window.open(formattedUrl)
      } else {
        window.location.href = formattedUrl
      }
    }
  }

  watch () {
    for (const link of this._links) {
      link.$element.addEventListener('click', link.onClick)
    }
  }

  unwatch () {
    for (const link of this._links) {
      link.$element.removeEventListener('click', link.onClick)
    }
  }
}