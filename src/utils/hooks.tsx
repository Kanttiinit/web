import format from 'date-fns/format';
import getIsoDay from 'date-fns/getISODay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import enLocale from 'date-fns/locale/en-GB';
import fiLocale from 'date-fns/locale/fi';
import parseISO from 'date-fns/parseISO';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import * as haversine from 'haversine';
import * as get from 'lodash/get';
import * as orderBy from 'lodash/orderBy';
import * as React from 'react';

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
import { state } from '../state';

export const useSelectedFavorites = () => {
  const { favorites } = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  return React.useMemo(() => {
    if (favorites.fulfilled) {
      return favorites.data.filter(
        ({ id }) => preferences.favorites.indexOf(id) > -1
      );
    }
    return [];
  }, [favorites.data, preferences.favorites]);
};

export const useIsFavorite = () => {
  const selectedFavorites = useSelectedFavorites();

  return React.useCallback(
    (course: CourseType) =>
      selectedFavorites.some(
        favorite => !!course.title.match(new RegExp(favorite.regexp, 'i'))
      ),
    [selectedFavorites]
  );
};

export const useSelectedArea = () => {
  const { areas } = React.useContext(dataContext);
  const { selectedArea } = React.useContext(preferenceContext);

  return React.useMemo(() => {
    return areas.data.find(a => a.id === selectedArea);
  }, [areas.data, selectedArea]);
};

export const useFormattedFavorites: () => FormattedFavoriteType[] = () => {
  const { favorites } = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  return React.useMemo(() => {
    return orderBy(favorites.data, ['name']).map((favorite: FavoriteType) => ({
      ...favorite,
      isSelected: preferences.favorites.indexOf(favorite.id) > -1
    }));
  }, [favorites.data, preferences.favorites]);
};

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

export const useFormattedRestaurants: () => RestaurantType[] = () => {
  const ui = React.useContext(uiContext);
  const data = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);
  const isFavorite = useIsFavorite();

  const formattedRestaurants = React.useMemo(() => {
    const day = ui.selectedDay;
    const restaurants = data.restaurants.data.map(restaurant => {
      const courses = get(
        data.menus.data,
        [restaurant.id, format(day, 'y-MM-dd')],
        []
      ).filter((course: CourseType) => course.title);
      const distance =
        ui.location && haversine(ui.location, restaurant, { unit: 'meter' });
      return {
        ...restaurant,
        courses,
        distance,
        favoriteCourses: courses.some(isFavorite),
        isOpenNow: isOpenNow(restaurant, day),
        isStarred: preferences.starredRestaurants.indexOf(restaurant.id) > -1,
        noCourses: !courses.length
      };
    });

    const order = getOrder(preferences.order, preferences.useLocation);
    return orderBy(restaurants, order.properties, order.orders);
  }, [
    ui.selectedDay,
    ui.location,
    data.restaurants.data,
    data.menus.data,
    preferences.favorites,
    preferences.starredRestaurants,
    preferences.order,
    preferences.useLocation
  ]);

  return formattedRestaurants;
};

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
