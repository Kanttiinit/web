import {fetchMenus} from './async';

export const SET_SELECTED_RESTAURANTS = 'SET_SELECTED_RESTAURANTS';
export const SET_FAVORITED_RESTAURANTS = 'SET_FAVORITED_RESTAURANTS';
export const SET_SELECTED_FAVORITE = 'SET_SELECTED_FAVORITE';

export function setIsSelected(value, include) {
   return {
      type: SET_SELECTED_FAVORITE,
      payload: {value, include}
   };
}

export function setSelectedRestaurants(values, include) {
   return dispatch => {
      dispatch({
         type: SET_SELECTED_RESTAURANTS,
         payload: {values, include}
      });
      dispatch(fetchMenus());
   };
}

export function setFavoritedRestaurants(values, include) {
   return {
      type: SET_FAVORITED_RESTAURANTS,
      payload: {values, include}
   }
}
