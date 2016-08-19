import React from 'react'
import {bindActionCreators} from 'redux'
import {Provider} from 'react-redux'

import '../styles/main.scss'

import store from '../store'
import {fetchAreas, fetchLocation, fetchMenus, fetchRestaurants, fetchFavorites} from '../store/actions/async'
import {selectLang} from '../store/selectors'

import App from './App'

const actions = bindActionCreators({
  fetchRestaurants,
  fetchAreas,
  fetchLocation,
  fetchFavorites,
  fetchMenus
}, store.dispatch)

const lang = selectLang(store.getState())

actions.fetchFavorites(lang)
actions.fetchRestaurants(lang)
actions.fetchAreas(lang)
actions.fetchMenus(lang)

actions.fetchLocation()

export default function() {
   return (
      <Provider store={store}>
         <App />
      </Provider>
   )
}
