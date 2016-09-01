import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import {autoRehydrate, persistStore} from 'redux-persist'
import {REHYDRATE} from 'redux-persist/constants'
import {SET_SELECTED_AREA} from './actions/preferences'
import saveLogger from 'redux-logger'
import {Set} from 'immutable'

import translations from '../utils/translations'

const defaultValues = {
   dayOffset: 0,
   initializing: true,
   modal: {}
}

const lang = navigator.language.split('-')[0]

const defaultPreferences = {
  lang: ['fi', 'en'].includes(lang) ? lang : 'fi',
  selectedArea: 1
}

const reducer = combineReducers({
   value: (state = defaultValues, {type, payload}) => {
      if (type.startsWith('SET_VALUE_')) {
         return {...state, ...payload}
      }
      return state
   },
   pending: (state = {}, {type, payload, meta = {}}) => {
      const key = meta.data
      if (key) {
         if (type.endsWith('_FULFILLED') || type.endsWith('_REJECTED')) {
            return {...state, [key]: false}
         } else if (type.endsWith('_PENDING')) {
            return {...state, [key]: true}
         }
      }
      return state
   },
   data: (state = {}, {type, payload, meta = {}}) => {
      const key = meta.data
      if (key && type.endsWith('_FULFILLED')) {
         return {...state, [key]: payload}
      }
      return state
   },
   error: (state = {}, {type, payload, meta = {}}) => {
      const key = meta.data
      if (key) {
         if (type.endsWith('_FULFILLED')) {
            return {...state, [key]: undefined}
         } else if (type.endsWith('_REJECTED')) {
            return {...state, [key]: payload}
         }
      }
      return state
   },
   preferences: (state = defaultPreferences, {type, payload}) => {
     if (type === REHYDRATE && payload.preferences) {
       return {
         lang: payload.preferences.lang,
         selectedArea: payload.preferences.selectedArea
       }
     } else if (type.startsWith('SET_PREFERENCE_')) {
        return {...state, ...payload}
     } else if (type === SET_SELECTED_AREA) {
        return {
          ...state,
          selectedArea: payload.areaId
        }
     }
     return state
   },
   translations: (state = translations, {type}) => state
})

const enhancer = compose(
   autoRehydrate(),
   applyMiddleware(thunk, promiseMiddleware()),
   window.devToolsExtension ? window.devToolsExtension() : f => f
)

const store = createStore(reducer, enhancer)

persistStore(store, {whitelist: 'preferences'}, () => {
  store.dispatch({
    type: 'SET_VALUE_INIT',
    payload: {initializing: false}
  })
})

export default store
