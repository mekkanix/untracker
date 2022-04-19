/******/ "use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/content/UTQueryManager.js
class UTQueryManager {
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

  _formatUrlQuery (query) {
    let strQuery = ''
    for (const [key, value] of Object.entries(query)) {
      strQuery += `&${key}=${value}`
    }
    return strQuery.substring(1)
  }

  _isFBTrackedURL (url) {
    const query = this.parseUrlQuery(url)
    return !!query.fbclid
  }

  _isGoogleUTMTrackedURL (url) {
    const q = this.parseUrlQuery(url)
    const hasUTMSource = !!q.utm_source
    const hasUTMCampaign = !!q.utm_campaign
    const hasUTMMedium = !!q.utm_medium
    const hasUTMTerm = !!q.utm_term
    const hasUTMContent = !!q.utm_content
    return hasUTMSource || hasUTMCampaign || hasUTMMedium || hasUTMTerm || hasUTMContent
  }

  _cleanURLQuery (url) {
    let query = this.parseUrlQuery(url)
    for (const paramName of this._trackingParams) {
      if (query[paramName]) {
        delete query[paramName]
      }
    }
    const fmtUrl = url.substring(0, url.indexOf('?'))
    const hasQuery = !!Object.keys(query).length
    return hasQuery ? `${fmtUrl}?${this._formatUrlQuery(query)}` : fmtUrl
  }

  // Public methods

  parseUrlQuery (url, onlyTracked = false) {
    const strQuery = url.substring(url.indexOf('?') + 1)
    const objQuery = strQuery.split('&').reduce((params, param) => {
      const key = param.substring(0, param.indexOf('='))
      const isTrackingParam = this._trackingParams.includes(key)
      if (!onlyTracked || (onlyTracked && isTrackingParam)) {
        const value = param.substring(param.indexOf('=') + 1)
        params[key] = value
      }
      return params
    }, {})
    return objQuery
  }

  isTrackedURL (url) {
    return this._isFBTrackedURL(url) || this._isGoogleUTMTrackedURL(url)
  }

  untrackURL (fullUrl) {
    const url = this._cleanURLQuery(fullUrl)
    return url
  }
}

;// CONCATENATED MODULE: ./src/content/UTContentManager.js


class UTContentManager {
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

;// CONCATENATED MODULE: ./src/content/utmain.js


// Retrieve UT options from storage
chrome.storage.sync.get(null, (items) => {
  const enabled = items.ut_options.enable
  const utContentManager = new UTContentManager(enabled)
  utContentManager.start()

  console.log('[UT Content] Ready.')
})

