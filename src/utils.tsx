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
import { Accessor, createMemo, createSignal } from 'solid-js';
import { sendFeedback } from './api';

import { CourseType, FavoriteType, Order, RestaurantType } from './types';
import { state, resources } from './state';
import { createStore } from 'solid-js/store';
import { ISortByObjectSorter, sort } from 'fast-sort';

export const selectedFavorites = createMemo(() => {
  if (!resources.favorites[0].loading) {
    return resources.favorites[0]()!.filter(
      ({ id }) => state.preferences.favorites.indexOf(id) > -1
    );
  }
  return [];
});

export const isFavorite = (course: CourseType) =>
  selectedFavorites().some(
    favorite => !!course.title.match(new RegExp(favorite.regexp, 'i'))
  );

export const formattedFavorites: Accessor<(FavoriteType & {
  isSelected: boolean;
})[]> = createMemo(() => {
  return sort(resources.favorites[0]() || [])
    .asc(i => i.name)
    .map((favorite: FavoriteType) => ({
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

const getOrder = (
  orderType: Order,
  useLocation: boolean
): ISortByObjectSorter<RestaurantType>[] => {
  if (orderType === Order.ALPHABET) {
    return [
      { desc: r => r.isStarred },
      { asc: r => r.noCourses },
      { asc: r => r.name }
    ];
  } else if (orderType === Order.DISTANCE && useLocation) {
    return [
      { desc: r => r.isStarred },
      { asc: r => r.noCourses },
      { asc: r => r.distance },
      { asc: r => r.name }
    ];
  } else {
    return [
      { desc: r => r.isStarred },
      { desc: r => r.isOpenNow },
      { asc: r => r.noCourses },
      { desc: r => r.favoriteCourses },
      { asc: r => r.distance },
      { desc: r => r.name }
    ];
  }
};

export const useFormattedRestaurants = createMemo(() => {
  const day = state.selectedDay;
  const restaurants = (resources.restaurants[0].latest || []).map(
    restaurant => {
      const courses =
        resources.menus[0].latest?.[restaurant.id]?.[
          format(day, 'y-MM-dd')
        ]?.filter(course => course.title) || [];
      const distance = state.location
        ? haversine(state.location, restaurant, { unit: 'meter' })
        : undefined;
      return {
        ...restaurant,
        courses,
        distance,
        favoriteCourses: courses.some(isFavorite),
        isOpenNow: isOpenNow(restaurant, day),
        isStarred:
          state.preferences.starredRestaurants.indexOf(restaurant.id) > -1,
        noCourses: !courses.length
      };
    }
  );

  return sort(restaurants).by(
    getOrder(state.preferences.order, state.preferences.useLocation)
  );
});

const locales = {
  en: enLocale,
  fi: fiLocale
};

export const formattedDay = (date: Date, dateFormat: string) =>
  createMemo(() => {
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

interface State {
  sending: boolean;
  sent: boolean;
  error: Error | null;
}

export function useFeedback(): [
  State,
  (message: string, email?: string) => Promise<void>
] {
  const [state, setState] = createStore<State>({
    error: null,
    sending: false,
    sent: false
  });

  return [
    state,
    async (message: string, email?: string) => {
      setState({ sending: true });
      try {
        await sendFeedback(message, email || 'anonymous');
        setState({ sending: false, sent: true, error: null });
      } catch (error) {
        setState({ sending: false, error });
      }
    }
  ];
}

type T = string | number;

export default function useInput(
  defaultValue: T
): [
  Accessor<T>,
  Accessor<{
    value: Accessor<T>;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  }>,
  (value: T) => void
] {
  const [value, setValue] = createSignal(defaultValue);
  const inputProps = createMemo(() => ({
    value,
    onChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (typeof defaultValue === 'number') {
        setValue(Number(e.target.value));
      } else {
        setValue(e.target.value);
      }
    }
  }));
  return [value, inputProps, setValue];
}

export function get(obj: any, path: string, def: any = undefined) {
  var fullPath = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
    .filter(Boolean);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step: any) {
    return !(step && (obj = obj[step]) === undefined);
  }
}
