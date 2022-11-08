import format from 'date-fns/format';
import getIsoDay from 'date-fns/getISODay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import enLocale from 'date-fns/locale/en-GB';
import fiLocale from 'date-fns/locale/fi';
import parseISO from 'date-fns/parseISO';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import haversine from 'haversine';
import * as get from 'lodash/get';
import * as orderBy from 'lodash/orderBy';
import { Accessor, createMemo } from 'solid-js';

import {
  dataContext,
  langContext,
  preferenceContext,
  uiContext
} from '../contexts';
import {
  CourseType,
  FavoriteType,
  FormattedFavoriteType,
  Order,
  RestaurantType
} from '../contexts/types';
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

export const createDayFormatter = () => {
  return () => {
    const lang = state.lang;
    return (date: Date, dateFormat: string) =>
    format(date, dateFormat, { locale: locales[lang] });
  };
};
