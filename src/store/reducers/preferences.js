import {REHYDRATE} from 'redux-persist/constants'
import startsWith from 'lodash/startsWith'
import {Set} from 'immutable'

import {SET_PREFERENCE_RESTAURANT_STARRED} from '../actions/preferences'

const lang = navigator.language.split('-')[0]

const defaultState = {
  lang: ['fi', 'en'].indexOf(lang) > -1 ? lang : 'fi',
  selectedArea: 1,
  useLocation: false,
  filtersExpanded: true,
  starredRestaurants: Set()
}

export default (state = defaultState, {type, payload}) => {
  if (type === REHYDRATE && payload.preferences) {
    return {
      ...defaultState,
      ...payload.preferences,
      starredRestaurants: Set(payload.preferences.starredRestaurants || [])
    }
  } else if (type === SET_PREFERENCE_RESTAURANT_STARRED) {
    const starredRestaurants = payload.isStarred
      ? state.starredRestaurants.add(payload.restaurantId)
      : state.starredRestaurants.remove(payload.restaurantId)
    return {
      ...state,
      starredRestaurants
    }
  } else if (startsWith(type, 'SET_PREFERENCE_')) {
    return {...state, ...payload}
  } else if (type === 'FETCH_USER_FULFILLED') {
    return {...state, ...payload.preferences}
  }
  return state
}
