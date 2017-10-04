// @flow
import {observable, computed} from 'mobx'
import orderBy from 'lodash/orderBy'
import moment from 'moment'
import get from 'lodash/get'
import haversine from 'haversine'

import Resource from './Resource'
import {uiState} from './index'
import type PreferenceStore from './PreferenceStore'
import type UIState from './UIState'
import type {AreaType, FavoriteType, FormattedFavoriteType, MenuType, RestaurantType, CourseType} from './types'

const isOpenNow = (restaurant: RestaurantType, day) => {
  const weekday = day.weekday()
  if (!restaurant.openingHours[weekday]) {
    return false
  }
  const [open, close] = restaurant.openingHours[weekday].split(' - ')
  const now = moment()
  return now.isAfter(moment(open, 'HH:mm')) && now.isBefore(moment(close, 'HH:mm'))
}

const orderRestaurants = (restaurants, orderType) => {
  const order = {
    properties: ['isStarred', 'isOpenNow', 'noCourses', 'favoriteCourses', 'distance'],
    orders: ['desc', 'desc', 'asc', 'desc', 'asc']
  }
  if (orderType === 'ORDER_ALPHABET') {
    order.properties = ['isStarred', 'noCourses', 'name']
    order.orders = ['desc', 'asc', 'asc']
  } else if (orderType === 'ORDER_DISTANCE') {
    order.properties = ['isStarred', 'noCourses', 'distance']
    order.orders = ['desc', 'asc', 'asc']
  }
  return orderBy(restaurants, order.properties, order.orders)
}

export default class DataStore {
  @observable areas: Resource<Array<AreaType>> = new Resource([])
  @observable favorites: Resource<Array<FavoriteType>> = new Resource([])
  @observable menus: Resource<MenuType> = new Resource({})
  @observable restaurants: Resource<Array<RestaurantType>> = new Resource([])

  preferences: PreferenceStore
  uiState: UIState

  constructor(preferenceStore: PreferenceStore, uiState: UIState) {
    this.preferences = preferenceStore
    this.uiState = uiState
  }

  @computed get selectedFavorites(): Array<FavoriteType> {
    if (this.favorites.fulfilled) {
      return this.favorites.data.filter(({id}) => this.preferences.favorites.indexOf(id) > -1)
    }
    return []
  }

  isFavorite(course: CourseType) {
    return this.selectedFavorites.some(favorite => course.title.match(new RegExp(favorite.regexp, 'i')))
  }

  @computed get selectedArea(): ?AreaType {
    return this.areas.data.find(a => a.id === this.preferences.selectedArea)
  }

  @computed get formattedFavorites(): Array<FormattedFavoriteType> {
    return orderBy(this.favorites.data, ['name']).map(favorite => ({
      ...favorite,
      isSelected: this.preferences.favorites.indexOf(favorite.id) > -1
    }))
  }

  @computed get formattedRestaurants(): Array<RestaurantType> {
    const day = moment(this.uiState.day)
    const formattedRestaurants = this.restaurants.data
    .map(restaurant => {
      let favoriteCourses = 0
      const courses = get(this.menus.data, [restaurant.id, day.format('YYYY-MM-DD')], [])
      .filter(course => course.title)
      .map(course => {
        const isFavorite = this.isFavorite(course)
        if (isFavorite) {
          favoriteCourses++
        }
        return {
          ...course,
          isFavorite
        }
      })
      const distance = uiState.location && haversine(uiState.location, restaurant, {unit: 'meter'})
      return {
        ...restaurant,
        courses,
        distance,
        noCourses: !courses.length,
        favoriteCourses: favoriteCourses > 0,
        isOpenNow: isOpenNow(restaurant, day),
        isStarred: this.preferences.starredRestaurants.includes(restaurant.id)
      }
    })

    return orderRestaurants(formattedRestaurants, this.preferences.order)
  }
 }