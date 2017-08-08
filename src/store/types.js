// @flow

export type PreferencesType = {}

export type RestaurantType = {
  id: number,
  name: string,
  longitude: number,
  latitude: number,
  openingHours: Array<string>,
  address: string,
  url: string
}

export type AreaType = {
  id: number,
  name: string,
  restaurants: Array<number>
}

export type FavoriteType = {
  id: number,
  name: string,
  regexp: string
}

export type FormattedFavoriteType = FavoriteType & {
  isSelected: boolean
}

export type MenuType = {

}

export type CourseType = {
  title: string,
  properties: Array<string>
}