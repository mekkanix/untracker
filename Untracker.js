function LOG(...msg) {
  console.log('[UNTRACKER]', ...msg);
}

class Untracker {
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

  isTrackedURL (url) {
    return this._isFBTrackedURL(url)
  }

  untrackURL (fullUrl) {
    let query = this._parseUrlQuery(fullUrl)
    if (query.fbclid) {
      delete query.fbclid
    }
    const url = fullUrl.substring(0, fullUrl.indexOf('?'))
    const hasQuery = !!Object.keys(query).length
    return hasQuery ? `${url}?${this._formatUrlQuery(query)}` : url
  }
}
