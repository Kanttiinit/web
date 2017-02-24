// @flow
import {observable, action} from 'mobx'

type Lang = 'fi' | 'en'
type Order = 'ORDER_AUTOMATIC' | 'ORDER_ALPHABET' | 'ORDER_DISTANCE'

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
}