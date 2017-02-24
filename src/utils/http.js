// @flow
import 'isomorphic-fetch'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default {
  fetch(method: Method, url: string, body: Object, authorize: boolean) {
    const options = {method, headers: {}, body: undefined, credentials: undefined}
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
  get(url: string, authorize?: boolean) {
    return this.fetch('GET', url, undefined, authorize)
  },
  post(url: string, data: Object) {
    return this.fetch('POST', url, data, true)
  },
  put(url: string, data: Object) {
    return this.fetch('PUT', url, data, true)
  },
  delete(url: string, data: Object) {
    return this.fetch('DELETE', url, data, true)
  }
}
