import trackAction from '../../utils/trackAction'
import http from '../../utils/http'

export function setDayOffset(dayOffset) {
  trackAction('set day offset', dayOffset)
  return {
    type: 'SET_VALUE_DAY_OFFSET',
    payload: {dayOffset: Math.min(Math.max(dayOffset, 0), 5)}
  }
}

export const setLocation = location => (dispatch, getState) => {
  http.post('/location', {...location, userHash: getState().preferences.userHash})
  dispatch({
    type: 'SET_VALUE_LOCATION',
    payload: {location}
  })
}

export function openModal(component) {
  trackAction('open modal')
  window.document.body.className = 'modal-open'
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
  trackAction('close modal')
  window.document.body.className = ''
  return {
    type: 'SET_VALUE_MODAL',
    payload: {
      modal: {
        open: false
      }
    }
  }
}
