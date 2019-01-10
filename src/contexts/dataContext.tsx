import * as React from 'react';
import {
  AreaType,
  FavoriteType,
  MenuType,
  RestaurantType,
  Update
} from '../store/types';

interface Resource<T> {
  data: T;
  error: Error | null;
  fulfilled: boolean;
  pending: boolean;
}

interface DataContext {
  areas: Resource<AreaType[]>;
  favorites: Resource<FavoriteType[]>;
  menus: Resource<MenuType>;
  restaurants: Resource<RestaurantType[]>;
  updates: Resource<Update[]>;
  setAreas(promise: Promise<AreaType[]>): any;
  setFavorites(promise: Promise<FavoriteType[]>): any;
  setMenus(promise: Promise<MenuType>): any;
  setRestaurants(promise: Promise<RestaurantType[]>): any;
  setUpdates(promise: Promise<Update[]>): any;
}

const dataContext = React.createContext<DataContext>({} as any);

function useResource<T>(
  defaultData: T
): [Resource<T>, ((promise: Promise<T>) => any)] {
  const [state, setState] = React.useState<Resource<T>>({
    data: defaultData,
    error: null,
    fulfilled: false,
    pending: false
  });

  const setData = async (promise: Promise<T>) => {
    setState({
      ...state,
      error: null,
      fulfilled: false,
      pending: true
    });
    try {
      setState({
        ...state,
        data: await promise,
        fulfilled: true,
        pending: false
      });
    } catch (e) {
      setState({
        ...state,
        data: defaultData,
        error: e.message,
        pending: false
      });
    }
  };

  return [state, setData];
}

export const DataContextProvider = (props: { children: React.ReactNode }) => {
  const [areas, setAreas] = useResource<AreaType[]>([]);
  const [favorites, setFavorites] = useResource<FavoriteType[]>([]);
  const [menus, setMenus] = useResource<MenuType>({});
  const [restaurants, setRestaurants] = useResource<RestaurantType[]>([]);
  const [updates, setUpdates] = useResource<Update[]>([]);

  return (
    <dataContext.Provider
      value={{
        areas,
        favorites,
        menus,
        restaurants,
        setAreas,
        setFavorites,
        setMenus,
        setRestaurants,
        setUpdates,
        updates
      }}
    >
      {props.children}
    </dataContext.Provider>
  );
};

export default dataContext;
