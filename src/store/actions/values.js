import moment from 'moment';

export function setDayOffset(dayOffset) {
   return {
      type: 'SET_VALUE_DAY_OFFSET',
      payload: {dayOffset: Math.min(Math.max(dayOffset, 0), 5)}
   };
}

export function setView(view) {
  return {
    type: 'SET_VALUE_VIEW',
    payload: {view}
  }
}

export function openModal(component) {
  return {
    type: 'SET_VALUE_MODAL',
    payload: {
      modal: {
        open: true,
        component
      }
    }
  }
}

export function closeModal() {
  return {
    type: 'SET_VALUE_MODAL',
    payload: {
      modal: {
        open: false
      }
    }
  }
}
