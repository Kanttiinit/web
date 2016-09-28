import 'isomorphic-fetch'

const API_BASE = 'https://kitchen.kanttiinit.fi'

export default {
  fetch(method, url, body, authorize) {
    const headers = {}
    if (this.token && authorize) {
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
  get(url, authorize) {
    return this.fetch('GET', url, undefined, authorize)
  },
  put(url, data) {
    return this.fetch('PUT', url, data, true)
  },
  setToken(token) {
    this.token = token
  }
}
