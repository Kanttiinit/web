import http from '../../utils/http';

export function fetchAreas() {
   return {
      type: 'FETCH_AREAS',
      payload: http.get('/areas'),
      meta: {
         data: 'areas'
      }
   };
}

export function fetchFavorites() {
   return {
      type: 'FETCH_FAVORITES',
      payload: http.get('/favorites'),
      meta: {
         data: 'favorites'
      }
   };
}

export function fetchLocation() {
   return {
      type: 'FETCH_LOCATION',
      payload: new Promise((resolve, reject) => {
         navigator.geolocation.getCurrentPosition(
            position => resolve(position.coords),
            error => console.log('could not get location', error),
            {timeout: 3000, maximumAge: 60000}
         );
      }),
      meta: {data: 'location'}
   };
}

export function fetchMenus() {
   return (dispatch, getState) => {
      // const idString = getState().preferences.selectedRestaurants.join(',');
      return dispatch({
         type: 'FETCH_MENUS',
         payload: http.get('/menus?restaurants'),
         meta: {
            data: 'menus'
         }
      });
   };
}

export function fetchRestaurants() {
   return {
      type: 'FETCH_RESTAURANTS',
      payload: http.get('/restaurants'),
      meta: {
         data: 'restaurants'
      }
   };
}
