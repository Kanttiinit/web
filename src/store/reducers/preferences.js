import {REHYDRATE} from 'redux-persist/constants'
import startsWith from 'lodash/startsWith'
import {Set} from 'immutable'

import {SET_PREFERENCE_RESTAURANT_STARRED} from '../actions/preferences'

const lang = navigator.language.split('-')[0]

const defaultState = {
  lang: ['fi', 'en'].indexOf(lang) > -1 ? lang : 'fi',
  selectedArea: 1,
  useLocation: false,
  starredRestaurants: Set(),
  favorites: [],
  order: 'ORDER_AUTOMATIC',
  userHash: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}

const toggleInSet = (list, value, toggle) => {
  if (toggle) {
    return list.add(value)
  } else {
    return list.remove(value)
  }
}

export default (state = defaultState, {type, payload}) => {
  if (type === REHYDRATE && payload.preferences) {
    return {
      ...state,
      ...defaultState,
      ...payload.preferences,
      starredRestaurants: Set(payload.preferences.starredRestaurants || [])
    }
  } else if (type === SET_PREFERENCE_RESTAURANT_STARRED) {
    return {
      ...state,
      starredRestaurants: toggleInSet(state.starredRestaurants, payload.restaurantId, payload.isStarred)
    }
  } else if (startsWith(type, 'SET_PREFERENCE_')) {
    return {...state, ...payload}
  } else if (type === 'FETCH_USER_FULFILLED') {
    return {
      ...state,
      ...payload.preferences,
      starredRestaurants: Set(payload.preferences.starredRestaurants || [])
    }
  }
  return state
}
