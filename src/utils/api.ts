import * as format from 'date-fns/format';
import http from './http';

import { AreaType, Lang, Update } from '../store/types';

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
  restaurantIds: number[],
  days: Date[],
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
    body: JSON.stringify({
      message
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

export const getUpdates = (): Promise<Update[]> => {
  return http.get('/updates');
};

export const getAreas = (lang: Lang): Promise<AreaType[]> =>
  http.get(`/areas?idsOnly=1&lang=${lang}`);

export const getFavorites = (lang: Lang) => http.get(`/favorites?lang=${lang}`);

export const getRestaurantsByIds = (ids: number[], lang: Lang) =>
  http.get(`/restaurants?lang=${lang}&ids=${ids.join(',')}`);

export const getRestaurantsByLocation = (
  latitude: number,
  longitude: number,
  lang: Lang
) => http.get(`/restaurants?lang=${lang}&location=${latitude},${longitude}`);
