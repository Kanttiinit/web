import { createStore } from 'solid-js/store';
import { createResource } from 'solid-js';
import * as api from './api';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import translations from './translations';
import { DarkModeChoice, HighlighOperator, Lang, Order, PriceCategory, RestaurantType, Update } from './types';
import parseISO from 'date-fns/parseISO';
import { createMemo } from 'solid-js';

const maxDayOffset = 6;

export function getDisplayedDays(): Date[] {
  const now = new Date();
  return Array(maxDayOffset + 1)
    .fill(0)
    .map((_: number, i: number) => addDays(now, i));
}

type TranslatedDict = { [t in keyof typeof translations]: any };

const migrateOldSettings = () => {
  return [
    'darkMode',
    'favorites',
    'lang',
    'selectedArea',
    'maxPriceCategory',
    'starredRestaurants',
    'properties',
    'location',
    'order',
    'updatesLastSeenAt'
  ].reduce((settings, i) => {
    const value = localStorage.getItem(i);
    if (value !== undefined && value !== null) {
      settings[i === 'location' ? 'useLocation' : i] = JSON.parse(value);
      localStorage.removeItem(i);
    }
    return settings;
  }, {} as Record<string, unknown>);
};

const persistedSettings = JSON.parse(
  localStorage.getItem('preferences') || '{}'
) as Record<string, unknown>;

const [state, setState] = createStore({
  location: null as GeolocationCoordinates | null,
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
    highlightOperator: HighlighOperator.OR,
    ...migrateOldSettings(),
    ...persistedSettings,
  },
  properties: [] as string[]
});

const areaResource = createResource(
  () => ({ lang: state.preferences.lang }),
  source => api.getAreas(source.lang)
);

const restaurantResourceSource = () => {
  return {
    area: state.preferences.selectedArea,
    location: state.location,
    lang: state.preferences.lang,
    starredRestaurants: state.preferences.starredRestaurants,
    maxPriceCategory: state.preferences.maxPriceCategory,
    areas: areaResource[0].latest,
    areasLoading: areaResource[0].loading
  };
};

const restaurantResource = createResource<RestaurantType[], ReturnType<typeof restaurantResourceSource>>(
  restaurantResourceSource,
  (source, v) => {
    if (source.area === -1) {
      if (!source.starredRestaurants.length)
        return [];

      return api.getRestaurantsByIds(source.starredRestaurants, source.lang);
    } else if (source.area === -2) {
      if (!source.location)
        return [];
        
      const { latitude, longitude } = source.location;
      return api.getRestaurantsByLocation(latitude, longitude, source.lang);
    } else if (source.areas?.length && !source.areasLoading) {
      const ids = source.areas.find(a => a.id === source.area)!.restaurants;
      if (v.value?.length && v.value?.every(r => ids.includes(r.id)))
        return v.value;

      return api.getRestaurantsByIds(ids, source.lang, source.maxPriceCategory);
    }
    return [];
  }
);

const menuResource = createResource(
  () => {
    return {
      restaurants: restaurantResource[0].latest,
      selectedDay: state.selectedDay,
      lang: state.preferences.lang
    };
  },
  source => {
    if (source.restaurants) {
      const restaurantIds = source.restaurants.map(restaurant => restaurant.id);
      return api.getMenus(restaurantIds, [source.selectedDay], source.lang);
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
  updates: createResource<Update[]>(() => api.getUpdates())
};

const computedState = {
  unseenUpdates: createMemo(() => {
    const updates: Update[] | undefined = resources.updates[0]();
    if (!state.preferences.updatesLastSeenAt || !updates) {
      return [];
    }

    return updates.filter(
      update =>
        parseISO(update.createdAt).getTime() >
        state.preferences.updatesLastSeenAt
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

export { state, setState, computedState, resources };
