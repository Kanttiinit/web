import React from 'react'
import {bindActionCreators} from 'redux'
import {Provider} from 'react-redux'
import page from 'page'
import key from 'keymaster'
import hello from 'hellojs'

import '../styles/main.scss'

import store from '../store'
import {setView, setDayOffset, closeModal, setAuthData} from '../store/actions/values'

import App from './App'
import Menus from './Menus'
import PrivacyPolicy from './PrivacyPolicy'
import Contact from './Contact'
import Beta from './Beta'
import Settings from './Settings'
import NotFound from './NotFound'

hello.init({
  facebook: '1841481822746867',
  google: '402535393048-osrrh9uci8031oh4sv3vepgifsol0rd8.apps.googleusercontent.com'
}, {
  scope: 'emails'
})

hello.on('auth', () => {
  const authData = store.getState().value.authData
  const googleAuth = hello.getAuthResponse('google')
  const facebookAuth = hello.getAuthResponse('facebook')
  if (!authData) {
    if (googleAuth) {
      store.dispatch(setAuthData({provider: 'google', token: googleAuth.access_token}))
    } else if (facebookAuth) {
      store.dispatch(setAuthData({provider: 'facebook', token: facebookAuth.access_token}))
    }
  }
})

hello.on('auth.logout', () => store.dispatch(setAuthData()))

const routes = {
  '/': Menus,
  '/privacy-policy': PrivacyPolicy,
  '/beta': Beta,
  '/contact': Contact,
  '/settings': Settings,
  '*': NotFound
}

key('left,right', (event, handler) => {
  const offset = handler.shortcut === 'left' ? -1 : 1
  store.dispatch(setDayOffset(store.getState().value.dayOffset + offset))
})

key('esc', () => store.dispatch(closeModal()))

Object.keys(routes).forEach(path => {
  page(path, () => {
    if (window.ga) {
      window.ga('send', 'pageview', path)
    }
    const route = {
      path,
      view: React.createElement(routes[path])
    }
    store.dispatch(setView(route))
  })
})
page()

export default () => (
  <Provider store={store}>
     <App />
  </Provider>
 )
