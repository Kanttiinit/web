import React from 'react'
import {Provider, connect} from 'react-redux'
import key from 'keymaster'
import http from '../utils/http'
import GA from 'react-ga'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import Menus from './Menus'
import PrivacyPolicy from './PrivacyPolicy'
import Contact from './Contact'
import Beta from './Beta'
import NotFound from './NotFound'
import Settings from './Menus/Settings'
import RestaurantModal from './RestaurantModal'

import store from '../store'
import {fetchUser} from '../store/actions/async'
import {setDayOffset, closeModal, openModal} from '../store/actions/values'
import parseAuth from '../utils/parseAuth'
import App from './App'

window.isBeta = location.hostname === 'beta.kanttiinit.fi' || location.hostname === 'localhost'
window.isProduction = process.env.NODE_ENV === 'production'

// keyboard shortcuts
key('left,right', (event, handler) => {
  const offset = handler.shortcut === 'left' ? -1 : 1
  store.dispatch(setDayOffset(store.getState().value.dayOffset + offset))
})

key('esc', () => store.dispatch(closeModal()))

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
  .then(() => store.dispatch(fetchUser()))
}

const dispatchCloseModal = () => store.dispatch(closeModal())

const AppRouter = connect(state => ({
  initializing: state.value.initializing
}))(({initializing}) => {
  if (initializing)
    return null

  return (
    <Router history={browserHistory}>
      <Route
        onEnter={pageView}
        onChange={pageView}
        path="/"
        component={App}>
        <Route component={Menus}>
          <IndexRoute />
          <Route
            path="settings"
            onLeave={dispatchCloseModal}
            onEnter={() => store.dispatch(openModal(<Settings />))} />
          <Route
            path="restaurant/:id"
            onLeave={dispatchCloseModal}
            onEnter={state => store.dispatch(openModal(<RestaurantModal restaurantId={+state.params.id} />))} />
        </Route>
        <Route path="privacy-policy" component={PrivacyPolicy} />
        <Route path="beta" component={Beta} />
        <Route path="contact" component={Contact} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  )
})

// export app wrapped in store provider
export default () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
)
