// @flow
import http from './http'
import moment from 'moment'

export const getCourses = async (restaurantId: number, day: moment.Moment) => {
  const restaurant = await http.get(`/restaurants/${restaurantId}/menu?day=${day.format('YYYY-MM-DD')}`)
  if (!restaurant.menus.length) {
    return []
  } else {
    return restaurant.menus[0].courses
  }
}

export const getMenus = (restaurantIds: Array<number>, days: Array<moment.Moment>, lang: string) => {
  return http.get(`/menus?lang=${lang}&restaurants=${restaurantIds.join(',')}&days=${days.map(day => day.format('YYYY-MM-DD')).join(',')}`)
}
