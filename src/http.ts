import 'whatwg-fetch';
import { apiBase } from './consts';

console.log(apiBase);

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default {
  fetch(method: Method, url: string, body: any, authorize: boolean) {
    const options: any = {
      body: undefined,
      credentials: undefined,
      headers: [],
      method
    };
    if (authorize) {
      options.credentials = 'include';
    }
    if (body) {
      options.headers.push(['Content-Type', 'application/json']);
      options.body = JSON.stringify(body);
    }
    return fetch(apiBase + url, options).then(r => {
      if (r.status >= 400) {
        return r.json().then(json => Promise.reject(json));
      }
      return r.json();
    });
  },
  get(url: string, authorize: boolean = false) {
    return this.fetch('GET', url, undefined, authorize);
  },
  post(url: string, data?: any) {
    return this.fetch('POST', url, data, true);
  },
  put(url: string, data?: any) {
    return this.fetch('PUT', url, data, true);
  },
  delete(url: string, data?: any) {
    return this.fetch('DELETE', url, data, true);
  }
};
