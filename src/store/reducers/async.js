import endsWith from 'lodash/endsWith'

export default {
  pending: (state = {}, {type, payload, meta = {}}) => {
     const key = meta.data
     if (key) {
        if (endsWith(type, '_FULFILLED') || endsWith(type, '_REJECTED')) {
           return {...state, [key]: false}
        } else if (endsWith(type, '_PENDING')) {
           return {...state, [key]: true}
        }
     }
     return state
  },
  data: (state = {}, {type, payload, meta = {}}) => {
     const key = meta.data
     if (key && endsWith(type, '_FULFILLED')) {
        return {...state, [key]: payload}
     }
     return state
  },
  error: (state = {}, {type, payload, meta = {}}) => {
     const key = meta.data
     if (key) {
        if (endsWith(type, '_FULFILLED')) {
           return {...state, [key]: undefined}
        } else if (endsWith(type, '_REJECTED')) {
           return {...state, [key]: payload}
        }
     }
     return state
  }
}
