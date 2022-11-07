import { createStore } from 'solid-js/store';
import addDays from 'date-fns/addDays';
import * as times from 'lodash/times';
import startOfDay from 'date-fns/startOfDay';
import translations from './utils/translations';
import { createResource, ResourceReturn } from "solid-js";
import * as api from './utils/api';

import { AreaType, DarkModeChoice, FavoriteType, Lang, MenuType, Order, PriceCategory, RestaurantType, Update } from "./contexts/types";
import parseISO from 'date-fns/parseISO';

const maxDayOffset = 6;
const dateFormat = 'y-MM-dd';

function getDisplayedDays(): Date[] {
  const now = new Date();
  return times(maxDayOffset + 1, (i: number) => addDays(now, i));
}

interface State {
  lang: Lang,
  location: GeolocationCoordinates | null;
  displayedDays: Date[];
  selectedDay: Date;
  data: {
    areas: AreaType[],
    favorites: ResourceReturn<FavoriteType[]>,
    menus: MenuType,
    restaurants: RestaurantType[],
    updates: ResourceReturn<Update[]>,
  },
  preferences: {
    selectedArea: number;
    useLocation: boolean;
    darkMode: DarkModeChoice;
    order: Order;
    favorites: number[];
    starredRestaurants: number[];
    updatesLastSeenAt: number;
    maxPriceCategory: PriceCategory;
  },
  properties: string[],
  darkMode: boolean,
  translations: TranslatedDict,
  unseenUpdates: Update[]
};

type TranslatedDict = { [t in keyof typeof translations]: string };

const [state, setState] = createStore<State>({
  lang: Lang.FI,
  location: null,
  displayedDays: getDisplayedDays(),
  selectedDay: startOfDay(new Date()),
  data: {
    areas: [],
    favorites: createResource<FavoriteType[]>(() => api.getFavorites(Lang.FI)),
    menus: {},
    restaurants: [],
    updates: createResource<Update[]>(() => api.getUpdates()),
  },
  preferences: {
    selectedArea: 1,
    useLocation: false,
    order: Order.AUTOMATIC,
    favorites: [],
    starredRestaurants: [],
    darkMode: DarkModeChoice.DEFAULT,
    updatesLastSeenAt: 0,
    maxPriceCategory: PriceCategory.studentPremium,
  },
  properties: [],
  get darkMode(): boolean {
    return this.preferences.darkMode === DarkModeChoice.ON;
  },
  get translations(): TranslatedDict {
    return Object.keys(translations).reduce<any>((t, key) => {
      t[key] = (translations as any)[key][this.lang];
      return t;
    }, {}) as TranslatedDict;
  },
  get unseenUpdates() {
    const updates: Update[] | undefined = this.data.updates[0]();
    if (!this.preferences.updatesLastSeenAt || !updates) {
      return [];
    }
  
    return updates.filter(
      update =>
        parseISO(update.createdAt).getTime() > this.preferences.updatesLastSeenAt
    );
  }
});

const actions = {
  toggleLang: () => setState({ lang: state.lang === Lang.FI ? Lang.EN : Lang.FI })
};

export {
  state,
  setState,
  actions
};
