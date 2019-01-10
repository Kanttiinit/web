import * as format from 'date-fns/format';
import * as getIsoDay from 'date-fns/get_iso_day';
import * as isAfter from 'date-fns/is_after';
import * as isBefore from 'date-fns/is_before';
import * as isSameDay from 'date-fns/is_same_day';
import * as parse from 'date-fns/parse';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as haversine from 'haversine';
import * as get from 'lodash/get';
import * as orderBy from 'lodash/orderBy';
import * as api from '../utils/api';

import * as React from 'react';

import {
  CourseType,
  FavoriteType,
  FormattedFavoriteType,
  Order,
  RestaurantType
} from '../store/types';
import { version } from '../utils/consts';
import dataContext from './dataContext';
import langContext from './langContext';
import preferenceContext from './preferencesContext';
import uiContext from './uiContext';

export const useSelectedFavorites = () => {
  const { favorites } = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  if (favorites.fulfilled) {
    return favorites.data.filter(
      ({ id }) => preferences.favorites.indexOf(id) > -1
    );
  }
  return [];
};

export const useIsFavorite = () => {
  const selectedFavorites = useSelectedFavorites();

  return (course: CourseType) =>
    selectedFavorites.some(
      favorite => !!course.title.match(new RegExp(favorite.regexp, 'i'))
    );
};

export const useUnseenUpdates = () => {
  const { updates } = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);
  if (!preferences.updatesLastSeenAt) {
    return [];
  }
  return updates.data.filter(
    update => parse(update.createdAt).getTime() > preferences.updatesLastSeenAt
  );
};

export const useSelectedArea = () => {
  const { areas } = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  return areas.data.find(a => a.id === preferences.selectedArea);
};

export const useFormattedFavorites: () => FormattedFavoriteType[] = () => {
  const { favorites } = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  return orderBy(favorites.data, ['name']).map((favorite: FavoriteType) => ({
    ...favorite,
    isSelected: preferences.favorites.indexOf(favorite.id) > -1
  }));
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

  const day = ui.selectedDay;
  const restaurants = data.restaurants.data.map(restaurant => {
    const courses = get(
      data.menus.data,
      [restaurant.id, format(day, 'YYYY-MM-DD')],
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
};

export const useAutoUpdates = () => {
  const { lang } = React.useContext(langContext);
  const preferences = React.useContext(preferenceContext);
  const ui = React.useContext(uiContext);
  const data = React.useContext(dataContext);
  const selectedArea = useSelectedArea();

  // fetch updates
  React.useEffect(() => {
    data.setUpdates(api.getUpdates());
  }, []);

  // update areas and restaurants
  React.useEffect(
    () => {
      data.setAreas(api.getAreas(lang));
      data.setFavorites(api.getFavorites(lang));
    },
    [lang]
  );

  // update restaurants
  React.useEffect(
    () => {
      let promise;
      if (lang && selectedArea) {
        promise = api.getRestaurantsByIds(selectedArea.restaurants, lang);
      } else if (preferences.selectedArea < 0) {
        if (preferences.selectedArea === -1) {
          if (preferences.starredRestaurants.length) {
            promise = api.getRestaurantsByIds(
              preferences.starredRestaurants,
              lang
            );
          } else {
            promise = Promise.resolve([]);
          }
        } else if (preferences.selectedArea === -2 && ui.location) {
          const { latitude, longitude } = ui.location;
          promise = api.getRestaurantsByLocation(latitude, longitude, lang);
        }
      }

      if (promise) {
        data.setRestaurants(promise);
      }
    },
    [selectedArea, lang]
  );

  // update menus
  React.useEffect(
    () => {
      if (data.restaurants.fulfilled) {
        const restaurantIds = data.restaurants.data.map(
          restaurant => restaurant.id
        );
        const menus = api.getMenus(restaurantIds, [ui.selectedDay], lang);
        data.setMenus(menus);
      }
    },
    [data.restaurants.data, ui.selectedDay, lang]
  );

  // update location
  const [locationWatchId, setLocationWatchId] = React.useState(null);
  React.useEffect(
    () => {
      // start or stop watching for location
      if (preferences.useLocation && !locationWatchId) {
        setLocationWatchId(
          navigator.geolocation.watchPosition(
            ({ coords }) => {
              ui.setLocation(coords);
            },
            error => {
              switch (error.code) {
                case 1:
                  preferences.setUseLocation(false);
              }
            }
          )
        );
      } else if (!preferences.useLocation && locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
        setLocationWatchId(null);
        ui.setLocation(null);
      }
    },
    [preferences.useLocation]
  );

  // update on window focus
  React.useEffect(() => {
    let lastUpdateCheck = Math.round(Date.now() / 1000);

    const update = async () => {
      // check for newer version and reload
      const now = Math.round(Date.now() / 1000);
      if (!lastUpdateCheck || now - lastUpdateCheck > 3600) {
        lastUpdateCheck = now;
        const response = await fetch(`/check-update?version=${version}`);
        const json = await response.json();
        if (json.updateAvailable) {
          window.location.reload();
        }
      }

      // update displayed days if first day is in past
      if (
        ui.displayedDays.length &&
        !isSameDay(new Date(), ui.displayedDays[0])
      ) {
        ui.updateDisplayedDays();
      }
    };

    window.addEventListener('focus', update);

    return () => window.removeEventListener('focus', update);
  }, []);
};
