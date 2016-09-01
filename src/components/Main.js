import React from 'react'
import {bindActionCreators} from 'redux'
import {Provider} from 'react-redux'
import page from 'page'
import key from 'keymaster'

import '../styles/main.scss'

import store from '../store'
import {setView, setDayOffset} from '../store/actions/values';

import App from './App'
import Menus from './Menus'
import PrivacyPolicy from './PrivacyPolicy'
import Contact from './Contact'
import Beta from './Beta'
import Settings from './Settings'
import NotFound from './NotFound'

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
