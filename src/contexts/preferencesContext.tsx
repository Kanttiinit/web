import * as without from 'lodash/without';
import * as React from 'react';

import { Order } from '../store/types';
import usePersistedState from '../utils/usePersistedState';

function toggleInArray<T>(array: T[], item: T): T[] {
  if (array.indexOf(item) === -1) {
    return array.concat(item);
  } else {
    return without(array, item);
  }
}

interface PreferenceContext {
  selectedArea: number;
  useLocation: boolean;
  darkMode: boolean;
  order: Order;
  favorites: number[];
  starredRestaurants: number[];
  updatesLastSeenAt: number;
  setUseLocation: (state: boolean) => void;
  setDarkMode(state: boolean): void;
  setOrder(state: Order): void;
  setRestaurantStarred(restaurantId: number, isStarred: boolean): void;
  setSelectedArea(areaId: number): void;
  setUpdatesLastSeenAt(time: number): void;
  toggleFavorite(favoriteId: number): void;
}

const preferenceContext = React.createContext<PreferenceContext>({} as any);

export const PreferenceContextProvider = (props: {
  children: React.ReactNode;
}) => {
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

  function toggleFavorite(favoriteId: number) {
    setFavorites(toggleInArray(favorites, favoriteId));
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
        order,
        selectedArea,
        setDarkMode,
        setOrder,
        setRestaurantStarred,
        setSelectedArea,
        setUpdatesLastSeenAt,
        setUseLocation,
        starredRestaurants,
        toggleFavorite,
        updatesLastSeenAt,
        useLocation
      }}
    >
      {props.children}
    </preferenceContext.Provider>
  );
};

export default preferenceContext;
