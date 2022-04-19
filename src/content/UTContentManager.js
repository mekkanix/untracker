import UTQueryManager from './UTQueryManager.js'

export default class UTContentManager {
  _enabled = false
  _queryManager = null
  _links = []
  _trackingParams = [
    // Google
    'utm_campaign',
    'utm_source',
    'utm_medium',
    'utm_term',
    'utm_content',
    // Facebook
    'fbclid',
  ]
  _trackingStats = {
    queryParams: [],
  }

  constructor (enabled = true) {
    this._enabled = enabled
    this._queryManager = new UTQueryManager()
    this._parseLinks()
    this._handleLiveStats()
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

  _handleLiveStats () {
    this._computeStats()
  }

  _computeStats () {
    for (const link of this._links) {
      const linkUrl = link.$element.getAttribute('href')
      if (this._queryManager.isTrackedURL(linkUrl)) {
        const linkQuery = this._queryManager.parseUrlQuery(linkUrl, true)
        // Add tracking params counter process here...
      }
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
