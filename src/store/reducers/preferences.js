import {REHYDRATE} from 'redux-persist/constants'
import startsWith from 'lodash/startsWith'

const lang = navigator.language.split('-')[0]

const defaultState = {
  lang: ['fi', 'en'].indexOf(lang) > -1 ? lang : 'fi',
  selectedArea: 1,
  useLocation: false,
  filtersExpanded: true
}

export default (state = defaultState, {type, payload}) => {
  if (type === REHYDRATE && payload.preferences) {
    return {...defaultState, ...payload.preferences}
  } else if (startsWith(type, 'SET_PREFERENCE_')) {
    return {...state, ...payload}
  } else if (type === 'FETCH_USER_FULFILLED') {
    return {...state, ...payload.preferences}
  }
  return state
}