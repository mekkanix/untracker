export default class UTQueryManager {
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
