import React from 'react'
import {Provider} from 'react-redux'
import key from 'keymaster'
import http from '../utils/http'
import GA from 'react-ga'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import Menus from './Menus'
import PrivacyPolicy from './PrivacyPolicy'
import Contact from './Contact'
import Beta from './Beta'
import NotFound from './NotFound'

import store from '../store'
import {setToken} from '../store/actions/preferences'
import {setDayOffset, closeModal} from '../store/actions/values'
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
GA.initialize('UA-55969084-5', {
  debug: !window.isProduction
})

// login if auth token is in URL
const auth = parseAuth()
if (auth) {
  http.get(`/me/login?${auth.provider}Token=${auth.token}`)
  .then(response => store.dispatch(setToken(response.token)))
}

// export app wrapped in store provider
export default () => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Menus} />
        <Route path="privacy-policy" component={PrivacyPolicy} />
        <Route path="beta" component={Beta} />
        <Route path="contact" component={Contact} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
)
