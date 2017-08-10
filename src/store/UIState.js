// @flow
import {observable, action} from 'mobx'
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD'

export default class UIState {
  @observable location: ?Coordinates
  @observable date: ?moment.Moment
  maxDayOffset = 5

  get day(): moment.Moment {
    if (this.date) {
      return this.date
    }
    return moment()
  }

  updateDay(location: Location) {
    const day = new URL(location.href).searchParams.get('day')
    this.date = day ? moment(day) : null
  }

  isDateInRange(date: moment.Moment) {
    const now = moment()
    return now.isSameOrBefore(date, 'day') && date.isSameOrBefore(now.add({day: this.maxDayOffset}), 'day')
  }

  getNewPath(date: moment.Moment) {
    const regexp = /day\=[^\&$]+/
    if (date.isSame(moment(), 'day')) {
      return location.pathname.replace(regexp, '')
    } else if (location.pathname.match(regexp)) {
      return location.pathname.replace(regexp, `day=${date.format(dateFormat)}`)
    }
    return `${location.pathname}?day=${date.format(dateFormat)}`
  }

  @action setLocation(location: Coordinates) {
    this.location = location
  }
}