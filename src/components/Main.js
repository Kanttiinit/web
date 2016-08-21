import React from 'react'
import {bindActionCreators} from 'redux'
import {Provider} from 'react-redux'
import page from 'page';

import '../styles/main.scss'

import store from '../store'
import {setView} from '../store/actions/values';
import {fetchAreas, fetchLocation, fetchMenus, fetchRestaurants, fetchFavorites} from '../store/actions/async'
import {selectLang} from '../store/selectors'

import App from './App'
import Restaurants from './Restaurants';
import PrivacyPolicy from './PrivacyPolicy';
import NotFound from './NotFound'

const lang = selectLang(store.getState())

store.dispatch(fetchFavorites(lang))
store.dispatch(fetchRestaurants(lang))
store.dispatch(fetchAreas(lang))
store.dispatch(fetchMenus(lang))

store.dispatch(fetchLocation())

const routes = {
  '/': Restaurants,
  '/privacy-policy': PrivacyPolicy,
  '*': NotFound
}

Object.keys(routes).forEach(path => {
  page(path, () => store.dispatch(setView(React.createElement(routes[path]))))
})
page()

export default function() {
   return (
      <Provider store={store}>
         <App />
      </Provider>
   )
}
