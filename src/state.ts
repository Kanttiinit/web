import { createStore } from 'solid-js/store';
import { createResource } from "solid-js";
import * as api from './api';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import translations from './translations';
import { DarkModeChoice, Lang, Order, PriceCategory, Update } from "./types";
import parseISO from 'date-fns/parseISO';
import { createMemo } from 'solid-js';

const maxDayOffset = 6;

export function getDisplayedDays(): Date[] {
  const now = new Date();
  return Array(maxDayOffset + 1).fill(0).map((_: number, i: number) => addDays(now, i));
}

type TranslatedDict = { [t in keyof typeof translations]: any };

const persistedSettings = JSON.parse(localStorage.getItem('preferences') || '{}') as Record<string, unknown>;

const [state, setState] = createStore({
  location: null as (GeolocationCoordinates | null),
  displayedDays: getDisplayedDays(),
  selectedDay: startOfDay(new Date()),
  preferences: {
    lang: Lang.FI,
    selectedArea: 1,
    useLocation: false,
    order: Order.AUTOMATIC,
    favorites: [] as number[],
    starredRestaurants: [] as number[],
    properties: [] as string[],
    darkMode: DarkModeChoice.DEFAULT,
    updatesLastSeenAt: 0,
    maxPriceCategory: PriceCategory.studentPremium,
    ...persistedSettings
  },
  properties: [] as string[]
});

const areaResource = createResource(() => ({ lang: state.preferences.lang }), source => api.getAreas(source.lang));

const restaurantResource = createResource(
  () => {
    return {
      area: state.preferences.selectedArea,
      location: state.location,
      lang: state.preferences.lang,
      starredRestaurants: state.preferences.starredRestaurants,
      maxPriceCategory: state.preferences.maxPriceCategory,
      areas: areaResource[0](),
      areasLoading: areaResource[0].loading
    };
  }, 
  source => {
    if (source.area === -1) {
      if (source.starredRestaurants.length) {
        return api.getRestaurantsByIds(source.starredRestaurants, source.lang);
      } else {
        return Promise.resolve([]);
      }
    } else if (source.area === -2) {
      if (source.location) {
        const { latitude, longitude } = source.location;
        return api.getRestaurantsByLocation(latitude, longitude, source.lang);
      } else {
        return Promise.resolve([]);
      }
    } else if (source.areas?.length && !source.areasLoading) {
      return api.getRestaurantsByIds(
        source.areas.find(a => a.id === source.area)!.restaurants,
        source.lang,
        source.maxPriceCategory
      );
    }
    return Promise.resolve([]);
  });

const menuResource = createResource(
  () => {
    return {
      restaurantsLoaded: !restaurantResource[0].loading && !areaResource[0].loading,
      restaurants: restaurantResource[0]() || [],
      selectedDay: state.selectedDay,
      lang: state.preferences.lang
    };
  },
  source => {
    if (source.restaurantsLoaded) {
      const restaurantIds = source.restaurants.map(
        restaurant => restaurant.id
      );
      return api.getMenus(restaurantIds, [source.selectedDay], source.lang);
    } else {
      return Promise.resolve({});
    }
  }
);

const resources = {
  areas: areaResource,
  favorites: createResource(
    () => ({ lang: state.preferences.lang }),
    source => api.getFavorites(source.lang)
  ),
  menus: menuResource,
  restaurants: restaurantResource,
  updates: createResource<Update[]>(() => api.getUpdates()),
};

const computedState = {
  unseenUpdates: createMemo(() => {
    const updates: Update[] | undefined = resources.updates[0]();
    if (!state.preferences.updatesLastSeenAt || !updates) {
      return [];
    }
  
    return updates.filter(
      update =>
        parseISO(update.createdAt).getTime() > state.preferences.updatesLastSeenAt
    );
  }),
  translations: createMemo(() => {
    return Object.keys(translations).reduce((t, k) => {
      const key = k as keyof typeof translations;
      t[key] = translations[key][state.preferences.lang];
      return t;
    }, {} as TranslatedDict) as TranslatedDict;
  }),
  darkMode: createMemo(() => {
    if (state.preferences.darkMode === DarkModeChoice.DEFAULT) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return state.preferences.darkMode === DarkModeChoice.ON;
  })
};

export {
  state,
  setState,
  computedState,
  resources
};
