// @flow
import {observable, action} from 'mobx'

type Lang = 'fi' | 'en';

class LangStore {
  @observable lang: Lang = 'fi'

  constructor() {
    this.lang = 'fi'
  }

  @action setLang(lang: Lang) {
    this.lang = lang
  }
}

export default new LangStore()