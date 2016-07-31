import moment from 'moment';
import _ from 'lodash';

export function updateNow() {
   const date = new Date();
   return {
      type: 'SET_VALUE_NOW',
      payload: {
         date,
         days: _.times(7, i => moment(date).add(i, 'days').format('YYYY-MM-DD'))
      }
   };
}

export function setCurrentView(view) {
   return (dispatch, getState) => dispatch({
      type: 'SET_VALUE_CURRENT_VIEW',
      payload: {
         currentView: view,
         views: getState().value.views + 1
      }
   });
}

export function setDayOffset(dayOffset) {
   return {
      type: 'SET_VALUE_DAY_OFFSET',
      payload: {dayOffset}
   };
}

export function setInitializing(initializing) {
   return {
      type: 'SET_VALUE_INITIALIZING',
      payload: {initializing}
   };
}
