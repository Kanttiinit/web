export enum PriceCategory {
  student = 'student',
  studentPremium = 'studentPremium',
  regular = 'regular',
}

export interface RestaurantType {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  openingHours: string[];
  address: string;
  url: string;
  isStarred: boolean;
  noCourses: boolean;
  isOpenNow: boolean;
  distance?: number;
  courses: CourseType[];
  priceCategory: PriceCategory;
  favoriteCourses?: boolean;
}

export interface AreaType {
  id: number;
  name: string;
  restaurants: number[];
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
    [date: string]: CourseType[];
  };
}

export interface CourseType {
  title: string;
  properties: string[];
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
  EN = 'en',
}

export enum Order {
  AUTOMATIC = 'ORDER_AUTOMATIC',
  ALPHABET = 'ORDER_ALPHABET',
  DISTANCE = 'ORDER_DISTANCE',
}

export enum DarkModeChoice {
  DEFAULT = 'DEFAULT',
  ON = 'ON',
  OFF = 'OFF',
}

export enum HighlighOperator {
  AND = 'and',
  OR = 'or',
}
