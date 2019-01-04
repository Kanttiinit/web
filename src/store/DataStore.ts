import * as format from 'date-fns/format';
import * as getIsoDay from 'date-fns/get_iso_day';
import * as isAfter from 'date-fns/is_after';
import * as isBefore from 'date-fns/is_before';
import * as parse from 'date-fns/parse';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as haversine from 'haversine';
import * as get from 'lodash/get';
import * as orderBy from 'lodash/orderBy';
import { computed, observable } from 'mobx';

import * as stores from './index';
import PreferenceStore from './PreferenceStore';
import Resource from './Resource';
import {
  AreaType,
  CourseType,
  FavoriteType,
  FormattedFavoriteType,
  MenuType,
  Order,
  RestaurantType,
  Update
} from './types';
import UIState from './UIState';

const parseTimeOfDay = (input: string) => {
  const parts = input.split(':');
  return setHours(setMinutes(new Date(), Number(parts[1])), Number(parts[0]));
};

const isOpenNow = (restaurant: RestaurantType, day: Date) => {
  const weekday = getIsoDay(day) - 1;
  if (!restaurant.openingHours[weekday]) {
    return false;
  }
  const [open, close] = restaurant.openingHours[weekday].split(' - ');
  const now = new Date();
  return (
    isAfter(now, parseTimeOfDay(open)) && isBefore(now, parseTimeOfDay(close))
  );
};

const getOrder = (orderType: Order, useLocation: boolean) => {
  if (orderType === Order.ALPHABET) {
    return {
      orders: ['desc', 'asc', 'asc'],
      properties: ['isStarred', 'noCourses', 'name']
    };
  } else if (orderType === Order.DISTANCE && useLocation) {
    return {
      orders: ['desc', 'asc', 'asc', 'asc'],
      properties: ['isStarred', 'noCourses', 'distance', 'name']
    };
  } else {
    return {
      orders: ['desc', 'desc', 'asc', 'desc', 'asc', 'asc'],
      properties: [
        'isStarred',
        'isOpenNow',
        'noCourses',
        'favoriteCourses',
        'distance',
        'name'
      ]
    };
  }
};

export default class DataStore {
  @observable
  areas: Resource<AreaType[]> = new Resource([]);
  @observable
  favorites: Resource<FavoriteType[]> = new Resource([]);
  @observable
  menus: Resource<MenuType> = new Resource({});
  @observable
  restaurants: Resource<RestaurantType[]> = new Resource([]);
  @observable
  updates: Resource<Update[]> = new Resource([]);

  preferences: PreferenceStore;
  uiState: UIState;

  constructor(preferenceStore: PreferenceStore, uiState: UIState) {
    this.preferences = preferenceStore;
    this.uiState = uiState;
  }

  @computed
  get selectedFavorites(): FavoriteType[] {
    if (this.favorites.fulfilled) {
      return this.favorites.data.filter(
        ({ id }) => this.preferences.favorites.indexOf(id) > -1
      );
    }
    return [];
  }

  isFavorite = (course: CourseType) => {
    return this.selectedFavorites.some(
      favorite => !!course.title.match(new RegExp(favorite.regexp, 'i'))
    );
  }

  @computed
  get unseenUpdates(): Update[] {
    if (!stores.preferenceStore.updatesLastSeenAt) {
      return [];
    }
    return this.updates.data.filter(
      update =>
        parse(update.createdAt).getTime() > this.preferences.updatesLastSeenAt
    );
  }

  @computed
  get selectedArea(): AreaType {
    return this.areas.data.find(a => a.id === this.preferences.selectedArea);
  }

  @computed
  get formattedFavorites(): FormattedFavoriteType[] {
    return orderBy(this.favorites.data, ['name']).map(
      (favorite: FavoriteType) => ({
        ...favorite,
        isSelected: this.preferences.favorites.indexOf(favorite.id) > -1
      })
    );
  }

  @computed
  get formattedRestaurants(): RestaurantType[] {
    const day = this.uiState.selectedDay;
    const formattedRestaurants = this.restaurants.data.map(restaurant => {
      const courses = get(
        this.menus.data,
        [restaurant.id, format(day, 'YYYY-MM-DD')],
        []
      ).filter((course: CourseType) => course.title);
      const distance =
        stores.uiState.location &&
        haversine(stores.uiState.location, restaurant, { unit: 'meter' });
      return {
        ...restaurant,
        courses,
        distance,
        favoriteCourses: courses.some(this.isFavorite),
        isOpenNow: isOpenNow(restaurant, day),
        isStarred:
          this.preferences.starredRestaurants.indexOf(restaurant.id) > -1,
        noCourses: !courses.length
      };
    });

    const order = getOrder(
      this.preferences.order,
      this.preferences.useLocation
    );
    return orderBy(formattedRestaurants, order.properties, order.orders);
  }
}
