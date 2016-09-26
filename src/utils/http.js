import 'isomorphic-fetch'

const API_BASE = 'https://kitchen.kanttiinit.fi'

export default {
  fetch(method, url, body) {
    const headers = {}
    if (this.token) {
      headers.Authorization = this.token
    }
    if (body) {
      headers['Content-Type'] = 'application/json'
    }
    return fetch(API_BASE + url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers
    })
    .then(r => r.json())
  },
  get(url, lang) {
    return this.fetch('GET', url + (lang ? '?&lang=' + lang : ''))
  },
  put(url, data) {
    return this.fetch('PUT', url, data)
  },
  setToken(token) {
    this.token = token
  }
}
