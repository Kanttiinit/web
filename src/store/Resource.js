// @flow
import http from '../utils/http'
import {observable} from 'mobx'

@observable
export default class Resource<T> {
  url: string
  authenticated: ?boolean
  @observable pending: boolean
  @observable fulfilled: boolean
  @observable error: ?string
  @observable data: Array<T>;
  constructor(url: string, authenticated?: boolean) {
    this.url = url
    this.authenticated = authenticated
    this.fulfilled = false
    this.pending = false
  }

  async fetch(lang?: string = 'fi') {
    this.pending = true
    try  {
      const response = await http.get(`/${this.url}?lang=${lang}`, !!this.authenticated)
      this.data = await response.json()
      this.fulfilled = true
    } catch(e) {
      this.error = e.message
    } finally {
      this.pending = false
    }
  }
}
