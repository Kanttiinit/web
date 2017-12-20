import {autorun, computed, observable, action} from 'mobx'
import {without} from 'lodash'
import { Lang, Order } from './types';

const toggleInArray = <T>(array: Array<T>, item: T): Array<T> => {
  if (array.indexOf(item) === -1) {
    return array.concat(item)
  } else {
    return without(array, item)
  }
}

const safeParseJson = (input: string) => {
  try {
    return JSON.parse(input || '{}')
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
  @observable properties: Array<string>

  constructor() {
    const state = localStorage.getItem('preferenceStore')
    this.setPreferences(safeParseJson(state))
    autorun(() => {
      localStorage.setItem('preferenceStore', JSON.stringify(this.getPreferences()))
    })
  }

  setPreferences(data: any) {
    const {lang, selectedArea, useLocation, order, favorites, starredRestaurants, properties} = data
    this.lang = lang || Lang.FI
    this.selectedArea = selectedArea || 1
    this.useLocation = useLocation || false
    this.order = order || Order.AUTOMATIC
    this.favorites = favorites || []
    this.starredRestaurants = starredRestaurants || []
    this.properties = properties || []
  }

  @computed getPreferences() {
    const {lang, selectedArea, useLocation, order, favorites, starredRestaurants, properties} = this
    return {lang, selectedArea, useLocation, order, favorites, starredRestaurants, properties}
  }

  @action toggleLanguage() {
    this.lang = this.lang === Lang.FI ? Lang.EN : Lang.FI
  }

  @action setRestaurantStarred(restaurantId: number, isStarred: boolean) {
    const index = this.starredRestaurants.indexOf(restaurantId)
    if (isStarred && index === -1) {
      this.starredRestaurants.push(restaurantId)
    } else if (!isStarred && index > -1) {
      this.starredRestaurants.splice(index, 1)
    }
  }

  @action toggleProperty(property: string) {
    this.properties = toggleInArray(this.properties, property)
  }

  isPropertySelected(property: string) {
    return this.properties.some(p => p.toLowerCase() === property.toLowerCase())
  }

  @action toggleFavorite(favoriteId: number) {
    this.favorites = toggleInArray(this.favorites, favoriteId)
  }
}