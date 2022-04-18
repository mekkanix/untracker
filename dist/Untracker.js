/******/ "use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/content/UTQueryManager.js
class UTQueryManager {
  _parseUrlQuery (url) {
    const strQuery = url.substring(url.indexOf('?') + 1)
    const objQuery = strQuery.split('&').reduce((params, param) => {
      const key = param.substring(0, param.indexOf('='))
      const value = param.substring(param.indexOf('=') + 1)
      params[key] = value
      return params
    }, {})
    return objQuery
  }
  
  _formatUrlQuery (query) {
    let strQuery = ''
    for (const [key, value] of Object.entries(query)) {
      strQuery += `&${key}=${value}`
    }
    return strQuery.substring(1)
  }

  _isFBTrackedURL (url) {
    const query = this._parseUrlQuery(url)
    return !!query.fbclid
  }

  _isGoogleUTMTrackedURL (url) {
    const q = this._parseUrlQuery(url)
    const hasUTMSource = !!q.utm_source
    const hasUTMCampaign = !!q.utm_campaign
    const hasUTMMedium = !!q.utm_medium
    const hasUTMTerm = !!q.utm_term
    const hasUTMContent = !!q.utm_content
    return hasUTMSource || hasUTMCampaign || hasUTMMedium || hasUTMTerm || hasUTMContent
  }

  _cleanURLQuery (url) {
    const trackingParams = [
      // FB
      'fbclid',
      // Google Analytics
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ]
    let query = this._parseUrlQuery(url)
    for (const paramName of trackingParams) {
      if (query[paramName]) {
        delete query[paramName]
      }
    }
    const fmtUrl = url.substring(0, url.indexOf('?'))
    const hasQuery = !!Object.keys(query).length
    return hasQuery ? `${fmtUrl}?${this._formatUrlQuery(query)}` : fmtUrl
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
;// CONCATENATED MODULE: ./src/content/utmain.js


// Retrieve UT options from storage
chrome.storage.sync.get(null, (items) => {
  const enabled = items.ut_options.enable
  const utContentManager = new UTContentManager(enabled)
  utContentManager.start()
})
