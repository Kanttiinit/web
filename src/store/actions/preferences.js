import trackAction from '../../utils/trackAction'
import {savePreferences} from './async'

export const SET_PREFERENCE_RESTAURANT_STARRED = 'SET_PREFERENCE_RESTAURANT_STARRED'
export const orders = ['ORDER_AUTOMATIC', 'ORDER_ALPHABET', 'ORDER_DISTANCE']

const saveablePreferenceAction = (type, key) => payload => dispatch => {
  trackAction(key, payload)
  dispatch(savePreferences({[key]: payload}))
  dispatch({
    type,
    payload: {[key]: payload}
  })
}

export const setLang = saveablePreferenceAction('SET_PREFERENCE_LANG', 'lang')

export const setSelectedArea = saveablePreferenceAction('SET_PREFERENCE_SELECTED_AREA', 'selectedArea')

export const setUseLocation = saveablePreferenceAction('SET_PREFERENCE_USE_LOCATION', 'useLocation')

export const setOrder = saveablePreferenceAction('SET_PREFERENCE_ORDER', 'order')

export function setFiltersExpanded(filtersExpanded) {
  trackAction('set filters expanded', filtersExpanded)
  return {
    type: 'SET_PREFERENCE_FILTERS_EXPANDED',
    payload: {filtersExpanded}
  }
}

export function setRestaurantStarred(restaurantId, isStarred) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PREFERENCE_RESTAURANT_STARRED,
      payload: {restaurantId, isStarred}
    })
    dispatch(savePreferences({starredRestaurants: getState().preferences.starredRestaurants}))
  }
}

export const setFavorites = saveablePreferenceAction('SET_PREFERENCE_FAVORITES', 'favorites')
