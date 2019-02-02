import * as React from 'react';

import { getApprovedUpdates } from '../utils/api';
import useArrayState from '../utils/useArrayState';
import usePersistedState from '../utils/usePersistedState';
import usePolledResource from '../utils/usePolledResource';
import { Order } from './types';

interface PreferenceContext {
  selectedArea: number;
  useLocation: boolean;
  darkMode: boolean;
  order: Order;
  favorites: number[];
  starredRestaurants: number[];
  updatesLastSeenAt: number;
  setUseLocation: (state: boolean) => void;
  addSuggestedUpdate(uuid: string): void;
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
  const [favorites, favoritesActions] = useArrayState(
    usePersistedState<number[]>('favorites', [])
  );
  const [starredRestaurants, starredRestaurantsActions] = useArrayState(
    usePersistedState<number[]>('starredRestaurants', [])
  );
  const [darkMode, setDarkMode] = usePersistedState('darkMode', false);
  const [updatesLastSeenAt, setUpdatesLastSeenAt] = usePersistedState(
    'updatesLastSeenAt',
    0
  );
  const [suggestedUpdates, suggestedUpdatesActions] = useArrayState(
    usePersistedState<string[]>('suggestedUpdates', [])
  );
  const approvedUpdates = usePolledResource(async () => {
    if (suggestedUpdates.length) {
      return getApprovedUpdates(suggestedUpdates);
    } else {
      return [];
    }
  });

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const context = React.useMemo(
    () => ({
      addSuggestedUpdate: suggestedUpdatesActions.push,
      darkMode,
      favorites,
      order,
      selectedArea,
      setDarkMode,
      setOrder,
      setRestaurantStarred: starredRestaurantsActions.setItemInArray,
      setSelectedArea,
      setUpdatesLastSeenAt,
      setUseLocation,
      starredRestaurants,
      toggleFavorite: favoritesActions.toggle,
      updatesLastSeenAt,
      useLocation
    }),
    [useLocation, selectedArea, darkMode, favorites, order, starredRestaurants]
  );

  return (
    <preferenceContext.Provider value={context}>
      {props.children}
    </preferenceContext.Provider>
  );
};

export default preferenceContext;
