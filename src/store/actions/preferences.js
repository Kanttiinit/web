export const SET_AREA_HIDDEN = 'SET_AREA_HIDDEN'

export function setLang(lang) {
   return {
      type: 'SET_PREFERENCE_LANG',
      payload: {lang}
   }
}

export function setAreaHidden(areaId, hidden) {
  return {
    type: SET_AREA_HIDDEN,
    payload: {areaId, hidden}
  }
}
