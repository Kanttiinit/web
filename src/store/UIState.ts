import {observable, action} from 'mobx'
import * as moment from 'moment'
import * as haversine from 'haversine'

const dateFormat = 'YYYY-MM-DD'

export default class UIState {
  @observable location: Coordinates | null
  @observable date: moment.Moment | null
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
    const regexp = /day=[^&$]+/
    if (date.isSame(moment(), 'day')) {
      return location.pathname.replace(regexp, '')
    } else if (location.pathname.match(regexp)) {
      return location.pathname.replace(regexp, `day=${date.format(dateFormat)}`)
    }
    return `${location.pathname}?day=${date.format(dateFormat)}`
  }

  @action setLocation(location: Coordinates) {
    if (this.location) {
      const distance = haversine(this.location, location, {unit: 'meter'})
      if (distance < 400) {
        return
      }
    }
    this.location = location
  }
}