import { autorun, observable, action } from 'mobx';
import * as without from 'lodash/without';
import { Lang, Order } from './types';
import { properties } from '../utils/translations';

const toggleInArray = <T>(array: Array<T>, item: T): Array<T> => {
  if (array.indexOf(item) === -1) {
    return array.concat(item);
  } else {
    return without(array, item);
  }
};

const safeParseJson = (input: string) => {
  try {
    return JSON.parse(input || '{}');
  } catch (e) {
    return {};
  }
};

export default class PreferenceStore {
  @observable
  lang: Lang;
  @observable
  selectedArea: number;
  @observable
  useLocation: boolean;
  @observable
  darkMode: boolean;
  @observable
  order: Order;
  @observable
  favorites: Array<number>;
  @observable
  starredRestaurants: Array<number>;
  @observable
  properties: Array<string>;
  @observable
  updatesLastSeenAt: number;

  constructor() {
    const state = localStorage.getItem('preferenceStore');
    this.setPreferences(safeParseJson(state));
    autorun(() => {
      const preferences = this.getPreferences();
      if (preferences.darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      localStorage.setItem('preferenceStore', JSON.stringify(preferences));
    });
  }

  setPreferences(data: any) {
    const {
      lang,
      selectedArea,
      useLocation,
      order,
      favorites,
      starredRestaurants,
      properties,
      darkMode,
      updatesLastSeenAt
    } = data;
    this.lang = lang || Lang.FI;
    this.selectedArea = selectedArea || 1;
    this.useLocation = useLocation || false;
    this.order = order || Order.AUTOMATIC;
    this.favorites = favorites || [];
    this.starredRestaurants = starredRestaurants || [];
    this.properties = properties || [];
    this.darkMode = darkMode || false;
    this.updatesLastSeenAt = updatesLastSeenAt || null;
  }

  getPreferences() {
    const {
      lang,
      selectedArea,
      useLocation,
      order,
      favorites,
      starredRestaurants,
      properties,
      darkMode,
      updatesLastSeenAt
    } = this;
    return {
      lang,
      selectedArea,
      useLocation,
      order,
      favorites,
      starredRestaurants,
      properties,
      darkMode,
      updatesLastSeenAt
    };
  }

  @action
  toggleLanguage() {
    this.lang = this.lang === Lang.FI ? Lang.EN : Lang.FI;
  }

  @action
  setRestaurantStarred(restaurantId: number, isStarred: boolean) {
    const index = this.starredRestaurants.indexOf(restaurantId);
    if (isStarred && index === -1) {
      this.starredRestaurants.push(restaurantId);
    } else if (!isStarred && index > -1) {
      this.starredRestaurants.splice(index, 1);
    }
  }

  @action
  toggleProperty(property: string) {
    this.properties = toggleInArray(this.properties, property);
  }

  getProperty(propertyKey: string) {
    return properties.find(p => p.key === propertyKey);
  }

  isPropertySelected(propertyKey: string) {
    return this.properties.some(
      p => p.toLowerCase() === propertyKey.toLowerCase()
    );
  }

  isDesiredProperty(propertyKey: string) {
    const property = this.getProperty(propertyKey);
    if (property && property.desired) {
      return this.isPropertySelected(propertyKey);
    }
    return false;
  }

  isUndesiredProperty(propertyKey: string) {
    const property = this.getProperty(propertyKey);
    if (property && !property.desired) {
      return this.isPropertySelected(propertyKey);
    }
    return false;
  }

  @action
  toggleFavorite(favoriteId: number) {
    this.favorites = toggleInArray(this.favorites, favoriteId);
  }
}
