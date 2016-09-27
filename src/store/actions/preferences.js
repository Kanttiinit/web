import trackAction from '../../utils/trackAction'
import http from '../../utils/http'

export const SET_PREFERENCE_RESTAURANT_STARRED = 'SET_PREFERENCE_RESTAURANT_STARRED'

const savePreferences = preferences =>
  http.token && http.put('/me/preferences', preferences)

export function setLang(lang) {
  trackAction('set lang', lang)
  savePreferences({lang})
  return {
    type: 'SET_PREFERENCE_LANG',
    payload: {lang}
  }
}

export function setSelectedArea(selectedArea) {
  trackAction('set selected area', selectedArea)
  savePreferences({selectedArea})
  return {
    type: 'SET_PREFERENCE_SELECTED_AREA',
    payload: {selectedArea}
  }
}

export function setUseLocation(useLocation) {
  trackAction('use location', useLocation)
  savePreferences({useLocation})
  return {
    type: 'SET_PREFERENCE_USE_LOCATION',
    payload: {useLocation}
  }
}

export function setFiltersExpanded(filtersExpanded) {
  trackAction('set filters expanded', filtersExpanded)
  return {
    type: 'SET_PREFERENCE_FILTERS_EXPANDED',
    payload: {filtersExpanded}
  }
}

export function setRestaurantStarred(restaurantId, isStarred) {
  return {
    type: SET_PREFERENCE_RESTAURANT_STARRED,
    payload: {restaurantId, isStarred}
  }
}

export function setToken(token) {
  return {
    type: 'SET_PREFERENCE_TOKEN',
    payload: {token}
  }
}
