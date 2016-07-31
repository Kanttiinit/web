import moment from 'moment';

export function setDayOffset(dayOffset) {
   return {
      type: 'SET_VALUE_DAY_OFFSET',
      payload: {dayOffset}
   };
}
