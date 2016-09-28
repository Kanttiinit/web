import http from '../../utils/http'

export function fetchAreas(lang) {
  return {
    type: 'FETCH_AREAS',
    payload: http.get('/areas?lang=' + lang),
    meta: {
      data: 'areas'
    }
  }
}

export function fetchUser() {
  return {
    type: 'FETCH_USER',
    payload: http.get('/me', true),
    meta: {
      data: 'user'
    }
  }
}

export function fetchFavorites(lang) {
  return {
    type: 'FETCH_FAVORITES',
    payload: http.get('/favorites?lang=' + lang),
    meta: {
      data: 'favorites'
    }
  }
}

export function fetchMenus(lang) {
  return {
    type: 'FETCH_MENUS',
    payload: http.get('/menus?restaurants?lang=' + lang),
    meta: {
      data: 'menus'
    }
  }
}

export function fetchRestaurants(lang) {
  return {
    type: 'FETCH_RESTAURANTS',
    payload: http.get('/restaurants?lang=' + lang),
    meta: {
      data: 'restaurants'
    }
  }
}
