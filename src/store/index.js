import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import {autoRehydrate, persistStore} from 'redux-persist'
import saveLogger from 'redux-logger'
import localForage from 'localforage'

import asyncReducers from './reducers/async'
import valueReducer from './reducers/value'
import preferencesReducer from './reducers/preferences'

import translations from '../utils/translations'

const reducer = combineReducers({
  ...asyncReducers,
  value: valueReducer,
  preferences: preferencesReducer,
  translations: () => translations
})

const enhancer = compose(
   autoRehydrate(),
   applyMiddleware(thunk, promiseMiddleware()),
   window.devToolsExtension ? window.devToolsExtension() : f => f
)

const store = createStore(reducer, enhancer)

persistStore(store, {
  whitelist: 'preferences',
  storage: localForage
}, () => {
  store.dispatch({
    type: 'SET_VALUE_INIT',
    payload: {initializing: false}
  })
})

export default store
