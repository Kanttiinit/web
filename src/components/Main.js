// @flow
import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
import key from 'keymaster'
import http from '../utils/http'
import GA from 'react-ga'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {dataStore, uiState} from '../store'

import Menus from './Menus'
import PrivacyPolicy from './PrivacyPolicy'
import Contact from './Contact'
import NotFound from './NotFound'
import Settings from './Menus/Settings'
import AreaSelector from './Menus/AreaSelector'
import FavoriteSelector from './Menus/FavoriteSelector'
import RestaurantModal from './RestaurantModal'

import parseAuth from '../utils/parseAuth'
import App from './App'

window.isBeta = location.hostname === 'beta.kanttiinit.fi' || location.hostname === 'localhost'
window.isProduction = process.env.NODE_ENV === 'production'

// keyboard shortcuts
key('left,right', (event, handler) => {
  const offset = handler.shortcut === 'left' ? -1 : 1
  uiState.setDayOffset(uiState.dayOffset + offset)
})

// analytics setup
GA.initialize('UA-85003235-1', {
  debug: !window.isProduction
})

const pageView = ({location: prev}, {location: next}) => {
  const location = next || prev
  GA.set({page: location.pathname})
  GA.pageview(location.pathname)
}

// login if auth token is in URL
const auth = parseAuth()
if (auth) {
  http.post('/me/login', auth)
  .then(() => dataStore.fetchUser())
}

const modalRouteProps = renderModal => ({
  onEnter: state => uiState.openModal(renderModal(state)),
  onLeave: () => uiState.closeModal()
})

export default () => (
  <Router history={browserHistory}>
    <Route
      onEnter={pageView}
      onChange={pageView}
      path="/"
      component={App}>
      <Route component={Menus}>
        <IndexRoute />
        <Route path="settings" {...modalRouteProps(() => <Settings />)} />
        <Route path="restaurant/:id" {...modalRouteProps(state => <RestaurantModal restaurantId={+state.params.id} />)} />
        <Route path="select-area" {...modalRouteProps(() => <AreaSelector />)} />
        <Route path="settings/favorites" {...modalRouteProps(() => <FavoriteSelector />)} />
        <Route path="privacy-policy" {...modalRouteProps(() => <PrivacyPolicy />)} />
        <Route path="contact" {...modalRouteProps(() => <Contact />)} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
)
