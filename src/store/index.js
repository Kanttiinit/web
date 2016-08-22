import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import {autoRehydrate, persistStore} from 'redux-persist'
import {REHYDRATE} from 'redux-persist/constants'
import saveLogger from 'redux-logger'

const defaultValues = {
   dayOffset: 0,
   initializing: true
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
   preferences: (state = {lang: 'fi'}, {type, payload}) => {
     if (type === REHYDRATE && payload.preferences) {
       return payload.preferences
     } else if (type.startsWith('SET_PREFERENCE_')) {
        return {...state, ...payload}
     }
     return state
   }
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
