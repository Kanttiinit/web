import { createStore } from 'solid-js/store';
import addDays from 'date-fns/addDays';
import * as times from 'lodash/times';
import startOfDay from 'date-fns/startOfDay';
import translations from './utils/translations';
import { createResource } from "solid-js";
import * as api from './utils/api';

import { AreaType, DarkModeChoice, FavoriteType, Lang, MenuType, Order, PriceCategory, RestaurantType, Update } from "./types";
import parseISO from 'date-fns/parseISO';

const maxDayOffset = 6;
const dateFormat = 'y-MM-dd';

export function getDisplayedDays(): Date[] {
  const now = new Date();
  return times(maxDayOffset + 1, (i: number) => addDays(now, i));
}

type TranslatedDict = { [t in keyof typeof translations]: any };

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
    ...JSON.parse(localStorage.getItem('preferences') || '{}') as {}
  },
  properties: [] as string[],
  get darkMode(): boolean {
    return this.preferences.darkMode === DarkModeChoice.ON;
  },
  get translations(): TranslatedDict {
    return Object.keys(translations).reduce<any>((t, key) => {
      t[key] = (translations as any)[key][this.preferences.lang];
      return t;
    }, {}) as TranslatedDict;
  },
  get unseenUpdates() {
    const updates: Update[] | undefined = resources.updates[0]();
    if (!this.preferences.updatesLastSeenAt || !updates) {
      return [];
    }
  
    return updates.filter(
      update =>
        parseISO(update.createdAt).getTime() > this.preferences.updatesLastSeenAt
    );
  }
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
      areas: areaResource[0]()
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
    } else if (source.areas?.length) {
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
      restaurantsLoaded: !restaurantResource[0].loading,
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

const actions = {
  toggleLang: () => setState('preferences', 'lang', state.preferences.lang === Lang.FI ? Lang.EN : Lang.FI)
};

export {
  state,
  setState,
  actions,
  resources
};
