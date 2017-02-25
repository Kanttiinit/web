// @flow
import React from 'react'
import {observable, action, computed, isObservable} from 'mobx'
import moment from 'moment'

import trackAction from '../utils/trackAction'

const dateFormat = 'YYYY/MM/DD'

export default class UIState {
  @observable location: ?Coordinates
  @observable dateString: string
  @observable modalOpened: boolean = false
  modalElement: React.Element<*>

  constructor() {
    this.modalOpened = false
  }

  @computed get dayOffset(): number {
    return moment(this.dateString, dateFormat).diff(moment(), 'days')
  }

  @action setDayOffset(days: number) {
    this.dateString = moment().add({days}).format(dateFormat)
  }

  @action setLocation(location: Coordinates) {
    this.location = location
  }

  @action setDateString(dateString: string) {
    this.dateString = dateString
  }

  @action openModal(element: React.Element<*>) {
    trackAction('open modal')
    this.modalElement = element
    this.modalOpened = true
  }

  @action closeModal() {
    trackAction('close modal')
    this.modalOpened = false
  }
}