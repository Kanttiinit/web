// @flow
import {autorun, observable, action, computable} from 'mobx'
import moment from 'moment'

const dateFormat = 'YYYY/MM/DD'

export default class UIState {
  @observable location: ?Coordinates
  @observable dateString: string

  @computable get dayOffset(): number {
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
}