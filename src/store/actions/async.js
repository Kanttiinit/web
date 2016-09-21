import http from '../../utils/http';

export function fetchAreas(lang) {
   return {
      type: 'FETCH_AREAS',
      payload: http.get('/areas', lang),
      meta: {
         data: 'areas'
      }
   };
}

export function fetchUser() {
  return {
    type: 'FETCH_USER',
    payload: http.get('/me'),
    meta: {
      data: 'user'
    }
  }
}

export function savePreferences(preferences) {
  return {
    type: 'SAVE_PREFERENCES',
    payload: http.put('/me/preferences', preferences),
    meta: {
      data: 'savePreferences'
    }
  }
}

export function fetchFavorites(lang) {
   return {
      type: 'FETCH_FAVORITES',
      payload: http.get('/favorites', lang),
      meta: {
         data: 'favorites'
      }
   };
}

export function fetchMenus(lang) {
   return (dispatch, getState) => {
      return dispatch({
         type: 'FETCH_MENUS',
         payload: http.get('/menus?restaurants', lang),
         meta: {
            data: 'menus'
         }
      });
   };
}

export function fetchRestaurants(lang) {
   return {
      type: 'FETCH_RESTAURANTS',
      payload: http.get('/restaurants', lang),
      meta: {
         data: 'restaurants'
      }
   };
}
