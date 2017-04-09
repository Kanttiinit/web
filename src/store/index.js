// @flow
import {autorun} from 'mobx'
import DataStore from './DataStore'
import PreferenceStore from './PreferenceStore'
import UIState from './UIState'
import http from '../utils/http'

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
  } else if (!preferenceStore.useLocation) {
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
  if (dataStore.user.fulfilled) {
    http.put('/me/preferences', preferenceStore.preferences)
  }
})

autorun(() => {
  if (dataStore.user.data) {
    preferenceStore.preferences = dataStore.user.data.preferences
  }
})

autorun(() => {
  let query
  if (preferenceStore.lang && dataStore.selectedArea) {
    query = `&ids=${dataStore.selectedArea.restaurants.join(',')}`
  } else if (preferenceStore.selectedArea < 0) {
    if (preferenceStore.selectedArea === -1) {
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
    dataStore.menus.fetch(http.get(`/menus?lang=${preferenceStore.lang}&restaurants=${restaurantIds.join(',')}`))
  }
})

dataStore.fetchUser()