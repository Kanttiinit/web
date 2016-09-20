import trackAction from '../../utils/trackAction'

export function setLang(lang) {
  trackAction('set lang', lang)
   return {
      type: 'SET_PREFERENCE_LANG',
      payload: {lang}
   }
}

export function setSelectedArea(selectedArea) {
  trackAction('set selected area', selectedArea)
  return {
    type: 'SET_PREFERENCE_SELECTED_AREA',
    payload: {selectedArea}
  }
}

export function setUseLocation(useLocation) {
  trackAction('use location', useLocation)
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

export function setToken(token) {
  return {
    type: 'SET_PREFERENCE_TOKEN',
    payload: {token}
  }
}
