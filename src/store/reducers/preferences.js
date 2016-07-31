import {combineReducers} from 'redux';
import Immutable from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';

import {SET_SELECTED_FAVORITE, SET_SELECTED_RESTAURANTS, SET_FAVORITED_RESTAURANTS} from '../actions/preferences';

const createNumberListReducer = (actionType, key) =>
(state = Immutable.Set([-1]), {type, payload}) => {
   if (type === REHYDRATE && payload.preferences) {
      return Immutable.Set(payload.preferences[key]);
   } else if (type === actionType) {
      const {include, value, values} = payload;
      if (value) {
         return state[include ? 'add' : 'delete'](value);
      } else if (values) {
         return state[include ? 'union' : 'subtract'](values);
      }
   }
   return state;
};

export default combineReducers({
   selectedFavorites: createNumberListReducer(SET_SELECTED_FAVORITE, 'selectedFavorites'),
   selectedRestaurants: createNumberListReducer(SET_SELECTED_RESTAURANTS, 'selectedRestaurants'),
   favoritedRestaurants: createNumberListReducer(SET_FAVORITED_RESTAURANTS, 'favoritedRestaurants')
});
