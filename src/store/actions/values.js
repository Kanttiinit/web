import trackAction from '../../utils/trackAction'

export function setDayOffset(dayOffset) {
  trackAction('set day offset', dayOffset)
  return {
    type: 'SET_VALUE_DAY_OFFSET',
    payload: {dayOffset: Math.min(Math.max(dayOffset, 0), 5)}
  }
}

export const setLocation = location => ({
  type: 'SET_VALUE_LOCATION',
  payload: {location}
})

export function openModal(component) {
  trackAction('open modal')
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
  return {
    type: 'SET_VALUE_MODAL',
    payload: {
      modal: {
        open: false
      }
    }
  }
}
