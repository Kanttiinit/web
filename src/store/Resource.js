// @flow
import {observable} from 'mobx'

export default class Resource<T> {
  @observable pending: boolean = false
  @observable fulfilled: boolean = false
  @observable error: ?string = null
  @observable data: T
  defaultData: T
  
  constructor(defaultData: T) {
    this.data = defaultData
    this.defaultData = defaultData
  }

  async fetch(promise: Promise<T>) {
    this.pending = true
    this.error = null
    this.fulfilled = false
    try {
      this.data = await promise
      this.fulfilled = true
    } catch (e) {
      this.error = e.message
      this.data = this.defaultData
    } finally {
      this.pending = false
    }
  }
}