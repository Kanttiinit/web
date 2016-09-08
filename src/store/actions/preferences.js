export function setLang(lang) {
   return {
      type: 'SET_PREFERENCE_LANG',
      payload: {lang}
   }
}

export function setSelectedArea(selectedArea) {
  return {
    type: 'SET_PREFERENCE_SELECTED_AREA',
    payload: {selectedArea}
  }
}

export function setUseLocation(useLocation) {
  return {
    type: 'SET_PREFERENCE_USE_LOCATION',
    payload: {useLocation}
  }
}

export function setFiltersExpanded(filtersExpanded) {
  return {
    type: 'SET_PREFERENCE_FILTERS_EXPANDED',
    payload: {filtersExpanded}
  }
}
