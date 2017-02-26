// @flow

export type PreferencesType = {}

export type UserType = {
  name: string,
  email: string,
  photo: string,
  displayName: string,
  preferences: PreferencesType
}

export type RestaurantType = {
  id: number
}

export type AreaType = {
  id: number,
  name: string,
  restaurants: Array<RestaurantType>
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
