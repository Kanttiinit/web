// @flow
import {autorun} from 'mobx'
import DataStore from './DataStore'
import PreferenceStore from './PreferenceStore'
import UIState from './UIState'
import http from '../utils/http'
import * as api from '../utils/api'

export const preferenceStore = new PreferenceStore()
export const uiState = new UIState()
export const dataStore = new DataStore(preferenceStore, uiState)

let locationWatchId
autorun(() => {
  // start or stop watching for location
  if (preferenceStore.useLocation && !locationWatchId) {
    locationWatchId = navigator.geolocation.watchPosition(({coords}) => {
      uiState.location = coords
    })
  } else if (!preferenceStore.useLocation && locationWatchId) {
    navigator.geolocation.clearWatch(locationWatchId)
    locationWatchId = null
    uiState.location = null
  }
})

autorun(() => {
  const lang = preferenceStore.lang
  dataStore.areas.fetch(http.get(`/areas?idsOnly=1&lang=${lang}`))
  dataStore.favorites.fetch(http.get(`/favorites?lang=${lang}`))
})

autorun(() => {
  let query
  if (preferenceStore.lang && dataStore.selectedArea) {
    query = `&ids=${dataStore.selectedArea.restaurants.join(',')}`
  } else if (preferenceStore.selectedArea < 0) {
    if (preferenceStore.selectedArea === -1 && preferenceStore.starredRestaurants.length) {
      query = `&ids=${preferenceStore.starredRestaurants.join(',')}`
    } else if (preferenceStore.selectedArea === -2 && uiState.location) {
      const {latitude, longitude} = uiState.location
      query = `&location=${latitude},${longitude}`
    }
  }

  if (query) {
    dataStore.restaurants.fetch(http.get(`/restaurants?lang=${preferenceStore.lang}${query}`))
  }
})

autorun(() => {
  if (dataStore.restaurants.fulfilled) {
    const restaurantIds = dataStore.restaurants.data.map(restaurant => restaurant.id)
    const menus = api.getMenus(restaurantIds, [uiState.day], preferenceStore.lang)
    dataStore.menus.fetch(menus)
  }
})
