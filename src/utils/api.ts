import format from 'date-fns/format';
import http from './http';

import {
  AreaType,
  CourseType,
  FavoriteType,
  Lang,
  MenuType,
  PriceCategory,
  RestaurantType,
  Update
} from '../types';

export const getCourses = async (
  restaurantId: number,
  day: Date,
  lang: Lang
): Promise<CourseType[]> => {
  const restaurant = await http.get(
    `/restaurants/${restaurantId}/menu?day=${format(
      day,
      'y-MM-dd'
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
): Promise<MenuType> => {
  return http.get(
    `/menus?lang=${lang}&restaurants=${restaurantIds.join(
      ','
    )}&days=${days.map(day => format(day, 'y-MM-dd')).join(',')}`
  );
};

export const sendFeedback = (message: string, email: string) =>
  fetch('https://kitchen.kanttiinit.fi/contact', {
    body: JSON.stringify({
      message,
      email
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

export const getFavorites = (lang: Lang): Promise<FavoriteType[]> =>
  http.get(`/favorites?lang=${lang}`);

export const getRestaurantsByIds = (
  ids: number[],
  lang: Lang,
  maxPriceCategory: PriceCategory = PriceCategory.regular
): Promise<RestaurantType[]> => {
  const categories = [
    PriceCategory.student,
    PriceCategory.studentPremium,
    PriceCategory.regular
  ];
  const priceCategories = categories.slice(
    0,
    categories.indexOf(maxPriceCategory) + 1
  );
  return http.get(
    `/restaurants?lang=${lang}&ids=${ids.join(
      ','
    )}&priceCategories=${priceCategories.join(',')}`
  );
};

export const getRestaurant = async (id: number, lang: Lang) => {
  const [restaurant] = await getRestaurantsByIds([id], lang);
  return restaurant;
};

export const getRestaurantsByLocation = (
  latitude: number,
  longitude: number,
  lang: Lang
): Promise<RestaurantType[]> =>
  http.get(`/restaurants?lang=${lang}&location=${latitude},${longitude}`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRestaurantChange = (restaurantId: number, change: any) =>
  http.post('/changes', {
    change,
    modelFilter: { id: restaurantId },
    modelName: 'Restaurant'
  });

export const getApprovedUpdates = (uuids: string[]) =>
  http.get(`/changes/${uuids.join(',')}`);
