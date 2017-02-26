// @flow
import React from 'react'
import {observable, action, computed} from 'mobx'
import moment from 'moment'

import trackAction from '../utils/trackAction'

const dateFormat = 'YYYY/MM/DD'

export default class UIState {
  @observable location: ?Coordinates
  @observable dateString: string
  @observable modalOpened: boolean = false
  @observable dayOffset: number = 0
  modalElement: React.Element<*>

  constructor() {
    this.modalOpened = false
  }

  @action setDayOffset(dayOffset: number) {
    this.dayOffset = Math.min(Math.max(0, dayOffset), 5)
  }

  @computed get date(): number {
    return moment().add(this.dayOffset, 'day').format(dateFormat)
  }

  set date(date: string) {
    this.dayOffset = moment(date, dateFormat).diff(moment(), 'days')
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