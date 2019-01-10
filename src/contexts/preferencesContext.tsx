import * as without from 'lodash/without';
import * as React from 'react';

import { Lang, Order } from '../store/types';
import * as translations from '../utils/translations';
import usePersistedState from '../utils/usePersistedState';

function toggleInArray<T>(array: T[], item: T): T[] {
  if (array.indexOf(item) === -1) {
    return array.concat(item);
  } else {
    return without(array, item);
  }
}

interface PreferenceContext {
  lang: Lang;
  selectedArea: number;
  useLocation: boolean;
  darkMode: boolean;
  order: Order;
  favorites: number[];
  starredRestaurants: number[];
  properties: string[];
  updatesLastSeenAt: number;
  setUseLocation: (state: boolean) => void;
  setDarkMode(state: boolean): void;
  setLang(state: Lang): void;
  setOrder(state: Order): void;
  setRestaurantStarred(restaurantId: number, isStarred: boolean): void;
  setSelectedArea(areaId: number): void;
  isDesiredProperty(propertyKey: string): boolean;
  isPropertySelected(propertyKey: string): boolean;
  isUndesiredProperty(propertyKey: string): boolean;
  setUpdatesLastSeenAt(time: number): void;
  toggleFavorite(favoriteId: number): void;
  toggleProperty(property: string): void;
  toggleLang(): void;
}

function getProperty(propertyKey: string) {
  return translations.properties.find(p => p.key === propertyKey);
}

const preferenceContext = React.createContext<PreferenceContext>({} as any);

export const PreferenceContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = usePersistedState('lang', Lang.FI);
  const [selectedArea, setSelectedArea] = usePersistedState('selectedArea', 1);
  const [useLocation, setUseLocation] = usePersistedState('location', false);
  const [order, setOrder] = usePersistedState('order', Order.AUTOMATIC);
  const [favorites, setFavorites] = usePersistedState<number[]>(
    'favorites',
    []
  );
  const [starredRestaurants, setStarredRestaurants] = usePersistedState<
    number[]
  >('starredRestaurants', []);
  const [properties, setProperties] = usePersistedState<string[]>(
    'properties',
    []
  );
  const [darkMode, setDarkMode] = usePersistedState('darkMode', false);
  const [updatesLastSeenAt, setUpdatesLastSeenAt] = usePersistedState(
    'updatesLastSeenAt',
    0
  );

  React.useEffect(
    () => {
      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    },
    [darkMode]
  );

  const toggleLang = () => {
    setLang(lang === Lang.FI ? Lang.EN : Lang.FI);
  };

  function isPropertySelected(propertyKey: string) {
    return properties.some(p => p.toLowerCase() === propertyKey.toLowerCase());
  }

  function isDesiredProperty(propertyKey: string) {
    const property = getProperty(propertyKey);
    if (property && property.desired) {
      return isPropertySelected(propertyKey);
    }
    return false;
  }

  function isUndesiredProperty(propertyKey: string) {
    const property = getProperty(propertyKey);
    if (property && !property.desired) {
      return isPropertySelected(propertyKey);
    }
    return false;
  }

  function toggleFavorite(favoriteId: number) {
    setFavorites(toggleInArray(favorites, favoriteId));
  }

  function toggleProperty(property: string) {
    setProperties(toggleInArray(properties, property));
  }

  function setRestaurantStarred(restaurantId: number, isStarred: boolean) {
    const ids = [...starredRestaurants];
    const index = ids.indexOf(restaurantId);
    if (isStarred && index === -1) {
      ids.push(restaurantId);
    } else if (!isStarred && index > -1) {
      ids.splice(index, 1);
    }
    setStarredRestaurants(ids);
  }

  return (
    <preferenceContext.Provider
      value={{
        darkMode,
        favorites,
        isDesiredProperty,
        isPropertySelected,
        isUndesiredProperty,
        lang,
        order,
        properties,
        selectedArea,
        setDarkMode,
        setLang,
        setOrder,
        setRestaurantStarred,
        setSelectedArea,
        setUpdatesLastSeenAt,
        setUseLocation,
        starredRestaurants,
        toggleFavorite,
        toggleLang,
        toggleProperty,
        updatesLastSeenAt,
        useLocation
      }}
    >
      {props.children}
    </preferenceContext.Provider>
  );
};

export default preferenceContext;
