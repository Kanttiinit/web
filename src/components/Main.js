import React from 'react'
import {bindActionCreators} from 'redux';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import localForage from 'localForage'

import '../styles/main.scss'

import store from '../store';
import {fetchAreas, fetchLocation, fetchMenus, fetchRestaurants, fetchFavorites} from '../store/actions/async';
import {updateNow, setKeyboardVisible} from '../store/actions/values';

import App from './App'

const actions = bindActionCreators({
  fetchRestaurants,
  fetchAreas,
  updateNow,
  fetchLocation,
  setKeyboardVisible,
  fetchFavorites,
  fetchMenus
}, store.dispatch)

class Main extends React.Component {
  componentWillMount() {
    actions.fetchFavorites()
    actions.fetchRestaurants()
    actions.fetchAreas()

    persistStore(store, {
      whitelist: 'preferences',
      storage: localForage
    }, () => {
      actions.fetchMenus()
    })

    actions.fetchLocation()
  }

  render() {
     return (
         <Provider store={store}>
            <App />
         </Provider>
      )
  }
}

export default Main
