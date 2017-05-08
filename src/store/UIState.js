// @flow
import {observable, action, computed} from 'mobx'
import moment from 'moment'

const dateFormat = 'YYYY/MM/DD'

export default class UIState {
  @observable location: ?Coordinates
  @observable dateString: string
  @observable dayOffset: number = 0
  maxDayOffset = 5

  @action setDayOffset(dayOffset: number) {
    this.dayOffset = Math.min(Math.max(0, dayOffset), this.maxDayOffset)
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
}