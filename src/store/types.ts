export interface RestaurantType {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  openingHours: Array<string>;
  address: string;
  url: string;
  isStarred: boolean;
  noCourses: boolean;
  isOpenNow: boolean;
  distance?: number;
  courses: CourseType[];
}

export interface AreaType {
  id: number;
  name: string;
  restaurants: Array<number>;
  mapImageUrl: string;
}

export interface FavoriteType {
  id: number;
  name: string;
  regexp: string;
}

export interface FormattedFavoriteType extends FavoriteType {
  isSelected: boolean;
}

export interface MenuType {
  [restaurantId: string]: {
    [date: string]: Array<CourseType>;
  };
}

export interface CourseType {
  title: string;
  properties: Array<string>;
  isFavorite: boolean;
  highlight: boolean;
  dim: boolean;
}

export type UpdateType = 'software-update' | 'information-update' | 'bugfix';

export interface Update {
  type: UpdateType;
  id: number;
  createdAt: string;
  title: string;
  description: string;
}

export enum Lang {
  FI = 'fi',
  EN = 'en'
}

export enum Order {
  AUTOMATIC = 'ORDER_AUTOMATIC',
  ALPHABET = 'ORDER_ALPHABET',
  DISTANCE = 'ORDER_DISTANCE'
}
