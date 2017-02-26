// @flow
import {autorun, observable, action} from 'mobx'
import without from 'lodash/without'

export const orders = ['ORDER_AUTOMATIC', 'ORDER_ALPHABET', 'ORDER_DISTANCE']

export type Lang = 'fi' | 'en'
export type Order = 'ORDER_AUTOMATIC' | 'ORDER_ALPHABET' | 'ORDER_DISTANCE'

const toggleInArray = <T>(array: Array<T>, item: T): Array<T> => {
  if (array.indexOf(item) === -1) {
    return array.concat(item)
  } else {
    return without(array, item)
  }
}

const safeParseJson = (input: string) => {
  try {
    return JSON.parse(input)
  } catch (e) {
    return {}
  }
}

export default class PreferenceStore {
  @observable lang: Lang
  @observable selectedArea: number
  @observable useLocation: boolean
  @observable order: Order
  @observable favorites: Array<number>
  @observable starredRestaurants: Array<number>

  constructor() {
    const state = localStorage.getItem('preferenceStore') || '{}'
    const {lang, selectedArea, useLocation, order, favorites, starredRestaurants} = safeParseJson(state)
    this.lang = lang || 'fi'
    this.selectedArea = selectedArea || 1
    this.useLocation = useLocation || false
    this.order = order || 'ORDER_AUTOMATIC'
    this.favorites = favorites || []
    this.starredRestaurants = starredRestaurants || []

    autorun(() => {
      const {lang, selectedArea, useLocation, order, favorites, starredRestaurants} = this
      localStorage.setItem('preferenceStore', JSON.stringify({
        lang, selectedArea, useLocation, order, favorites, starredRestaurants
      }))
    })
  }

  @action setRestaurantStarred(restaurantId: number, isStarred: boolean) {
    const index = this.starredRestaurants.indexOf(restaurantId)
    if (isStarred && index === -1) {
      this.starredRestaurants.push(restaurantId)
    } else if (!isStarred && index > -1) {
      // TODO: fix later
      this.starredRestaurants.slice(index, 1)
    }
  }

  @action toggleFavorite(favoriteId: number) {
    this.favorites = toggleInArray(this.favorites, favoriteId)
  }
}