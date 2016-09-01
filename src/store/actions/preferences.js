export const SET_SELECTED_AREA = 'SET_SELECTED_AREA'

export function setLang(lang) {
   return {
      type: 'SET_PREFERENCE_LANG',
      payload: {lang}
   }
}

export function setSelectedArea(areaId) {
  return {
    type: SET_SELECTED_AREA,
    payload: {areaId}
  }
}
