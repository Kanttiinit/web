// @flow
import {observable, action} from 'mobx'
import without from 'lodash/without'

export const orders = ['ORDER_AUTOMATIC', 'ORDER_ALPHABET', 'ORDER_DISTANCE']

export type Lang = 'fi' | 'en'
export type Order = 'ORDER_AUTOMATIC' | 'ORDER_ALPHABET' | 'ORDER_DISTANCE'

const toggleInArray = <T>(array: Array<T>, item: T) => {
  if (array.indexOf(item) === -1) {
    return array.concat(item)
  } else {
    return without(array, item)
  }
}

export default class PreferenceStore {
  @observable lang: Lang = 'fi'
  @observable selectedArea: number = 1
  @observable useLocation: boolean = false
  @observable order: Order = 'ORDER_AUTOMATIC'
  @observable favorites: Array<number> = []
  @observable starredRestaurants: Array<number> = []

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