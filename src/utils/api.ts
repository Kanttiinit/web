import http from './http';
import * as format from 'date-fns/format';

import { Lang, Update } from '../store/types';

export const getCourses = async (
  restaurantId: number,
  day: Date,
  lang: Lang
) => {
  const restaurant = await http.get(
    `/restaurants/${restaurantId}/menu?day=${format(
      day,
      'YYYY-MM-DD'
    )}&lang=${lang}`
  );
  if (!restaurant.menus.length) {
    return [];
  } else {
    return restaurant.menus[0].courses;
  }
};

export const getMenus = (
  restaurantIds: Array<number>,
  days: Array<Date>,
  lang: string
) => {
  return http.get(
    `/menus?lang=${lang}&restaurants=${restaurantIds.join(',')}&days=${days
    .map(day => format(day, 'YYYY-MM-DD'))
    .join(',')}`
  );
};

export const sendFeedback = (message: string) =>
  fetch('https://bot.kanttiinit.fi/feedback', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message
    })
  });

export const getUpdates = (): Promise<Array<Update>> => {
  return http.get('/updates');
};

export const getAreas = (lang: Lang) =>
  http.get(`/areas?idsOnly=1&lang=${lang}`);

export const getFavorites = (lang: Lang) => http.get(`/favorites?lang=${lang}`);

export const getRestaurantsByIds = (ids: Array<number>, lang: Lang) =>
  http.get(`/restaurants?lang=${lang}&ids=${ids.join(',')}`);

export const getRestaurantsByLocation = (
  latitude: number,
  longitude: number,
  lang: Lang
) => http.get(`/restaurants?lang=${lang}&location=${latitude},${longitude}`);
