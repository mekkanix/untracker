import UTQueryManager from './UTQueryManager.js'

export default class UTContentManager {
  _enabled = false
  _queryManager = null
  _links = []

  constructor (enabled = true) {
    this._enabled = enabled
    this._queryManager = new UTQueryManager()
    this._parseLinks()
    this._handleLiveUpdates()
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

  _handleLiveUpdates () {
    chrome.storage.onChanged.addListener((changes, type) => {
      if (type === 'sync') {
        const stgOpts = changes.ut_options
        // watch for 'enable' option update
        if (stgOpts && stgOpts.oldValue.enable !== stgOpts.newValue.enable) {
          this._enabled = stgOpts.newValue.enable
          this._updateInternalState()
        }
      }
    })
  }

  _updateInternalState () {
    for (const link of this._links) {
      if (this._enabled) {
        link.$element.addEventListener('click', link.onClick)
      } else {
        link.$element.removeEventListener('click', link.onClick)
      }
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

  start () {
    this._updateInternalState()
  }
}