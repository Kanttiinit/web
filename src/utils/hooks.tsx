import format from 'date-fns/format';
import getIsoDay from 'date-fns/getISODay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import enLocale from 'date-fns/locale/en-GB';
import fiLocale from 'date-fns/locale/fi';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import startOfDay from 'date-fns/startOfDay';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import haversine from 'haversine';
import * as get from 'lodash/get';
import * as orderBy from 'lodash/orderBy';
import { Accessor, createMemo } from 'solid-js';

import {
  CourseType,
  FavoriteType,
  Order,
  RestaurantType
} from '../types';
import { resources, state } from '../state';

export const selectedFavorites = createMemo(() => {
  if (!resources.favorites[0].loading) {
    return resources.favorites[0]()!.filter(
      ({ id }) => state.preferences.favorites.indexOf(id) > -1
    );
  }
  return [];
});

export const isFavorite = (course: CourseType) => selectedFavorites().some(favorite => !!course.title.match(new RegExp(favorite.regexp, 'i')));

export const formattedFavorites: Accessor<(FavoriteType & { isSelected: boolean })[]> = createMemo(() => {
    return orderBy(resources.favorites[0](), ['name']).map((favorite: FavoriteType) => ({
      ...favorite,
      isSelected: state.preferences.favorites.indexOf(favorite.id) > -1
    }));
  });

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

export const useFormattedRestaurants = createMemo(() => {
  const day = state.selectedDay;
  const restaurants = (resources.restaurants[0]() || []).map(restaurant => {
    const courses = get(
      resources.menus[0]() || {},
      [restaurant.id, format(day, 'y-MM-dd')],
      []
    ).filter((course: CourseType) => course.title);
    const distance =
      state.location && haversine(state.location, restaurant, { unit: 'meter' });
    return {
      ...restaurant,
      courses,
      distance,
      favoriteCourses: courses.some(isFavorite),
      isOpenNow: isOpenNow(restaurant, day),
      isStarred: state.preferences.starredRestaurants.indexOf(restaurant.id) > -1,
      noCourses: !courses.length
    };
  });

  const order = getOrder(state.preferences.order, state.preferences.useLocation);
  return orderBy(restaurants, order.properties, order.orders) as (typeof restaurants);
});

const locales = {
  en: enLocale,
  fi: fiLocale
};

export const formattedDay = (date: Date, dateFormat: string) => createMemo(() => {
  const lang = state.preferences.lang;
  return format(date, dateFormat, { locale: locales[lang] });
});

export function getArrayWithToggled<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index === -1) {
    return [...array, item];
  }
  const out = [...array];
  out.splice(index, 1);
  return out;
}

const maxDayOffset = 6;
const dateFormat = 'y-MM-dd';

export function isDateInRange(date: Date) {
  const now = startOfDay(new Date());
  const end = addDays(now, maxDayOffset);
  return (
    (isSameDay(now, date) || isBefore(now, date)) &&
    (isSameDay(date, end) || isBefore(date, end))
  );
}

export function getNewPath(date: Date) {
  const regexp = /day=[^&$]+/;
  if (isSameDay(date, new Date())) {
    return location.pathname.replace(regexp, '');
  } else if (location.pathname.match(regexp)) {
    return location.pathname.replace(regexp, `day=${format(date, dateFormat)}`);
  }
  return `${location.pathname}?day=${format(date, dateFormat)}`;
}

