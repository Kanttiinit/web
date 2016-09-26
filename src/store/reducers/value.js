import startsWith from 'lodash/startsWith'

const defaultState = {
  dayOffset: 0,
  initializing: true,
  modal: {}
}

export default (state = defaultState, {type, payload}) => {
  if (startsWith(type, 'SET_VALUE_')) {
    return {...state, ...payload}
  }
  return state
}
