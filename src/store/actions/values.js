import moment from 'moment';

export function setDayOffset(dayOffset) {
   return {
      type: 'SET_VALUE_DAY_OFFSET',
      payload: {dayOffset}
   };
}

export function setLang(lang) {
   return {
      type: 'SET_VALUE_LANG',
      payload: {lang}
   };
}

export function setView(view) {
  return {
    type: 'SET_VALUE_VIEW',
    payload: {view}
  }
}
