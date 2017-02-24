// @flow
import React from 'react'
import {observable, action} from 'mobx'

import trackAction from '../utils/trackAction'

export default class ModalStore {
  @observable opened: boolean = false
  component: React.Component<*, *, *>

  @action open(component: React.Component<*, *, *>) {
    trackAction('open modal')
    this.component = component
    this.opened = true
  }

  @action close() {
    trackAction('close modal')
    this.opened = false
  }
}