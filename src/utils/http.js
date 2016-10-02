import 'isomorphic-fetch'

export default {
  fetch(method, url, body, authorize) {
    const options = {method, headers: {}}
    if (authorize) {
      options.credentials = 'include'
    }
    if (body) {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    }
    return fetch(apiBase + url, options)
    .then(r => {
      if (r.status >= 400) {
        return r.json().then(json => Promise.reject(json))
      }
      return r.json()
    })
  },
  get(url, authorize) {
    return this.fetch('GET', url, undefined, authorize)
  },
  post(url, data) {
    return this.fetch('POST', url, data, true)
  },
  put(url, data) {
    return this.fetch('PUT', url, data, true)
  },
  delete(url, data) {
    return this.fetch('DELETE', url, data, true)
  }
}
