import { observable, action } from 'mobx';
import * as haversine from 'haversine';
import * as times from 'lodash/times';
import * as addDays from 'date-fns/add_days';
import * as parse from 'date-fns/parse';
import * as format from 'date-fns/format';
import * as isSameDay from 'date-fns/is_same_day';
import * as startOfDay from 'date-fns/start_of_day';
import * as isBefore from 'date-fns/is_before';

const dateFormat = 'YYYY-MM-DD';

export default class UIState {
  @observable
  location: Coordinates | null;
  @observable
  displayedDays: Array<Date> = [];
  @observable
  date: Date | null;
  maxDayOffset = 5;

  constructor() {
    this.updateDisplayedDays();
  }

  get selectedDay(): Date {
    if (this.date) {
      return this.date;
    }
    return startOfDay(new Date());
  }

  updateDisplayedDays() {
    this.displayedDays = times(6, i => addDays(new Date(), i));
  }

  updateDay(location: Location) {
    const day = new URL(location.href).searchParams.get('day');
    this.date = day ? startOfDay(parse(day)) : null;
  }

  isDateInRange(date: Date) {
    const now = startOfDay(new Date());
    const end = addDays(now, this.maxDayOffset);
    return (
      (isSameDay(now, date) || isBefore(now, date)) &&
      (isSameDay(date, end) || isBefore(date, end))
    );
  }

  getNewPath(date: Date) {
    const regexp = /day=[^&$]+/;
    if (isSameDay(date, new Date())) {
      return location.pathname.replace(regexp, '');
    } else if (location.pathname.match(regexp)) {
      return location.pathname.replace(
        regexp,
        `day=${format(date, dateFormat)}`
      );
    }
    return `${location.pathname}?day=${format(date, dateFormat)}`;
  }

  @action
  setLocation(location: Coordinates) {
    if (this.location) {
      const distance = haversine(this.location, location, { unit: 'meter' });
      if (distance < 400) {
        return;
      }
    }
    this.location = location;
  }
}
