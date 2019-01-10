import * as React from 'react';
import {
  AreaType,
  FavoriteType,
  MenuType,
  RestaurantType,
  Update
} from '../store/types';
import useResource, { Resource } from '../utils/useResource';

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
