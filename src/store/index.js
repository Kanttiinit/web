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
  if (preferenceStore.useLocation && !this.locationWatchId) {
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
  dataStore.areas.fetch(http.get(`/areas?lang=${lang}`))
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

dataStore.fetchUser()