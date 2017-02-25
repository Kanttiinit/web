// @flow
export type UserType = {
  name: string,
  email: string,
  photo: string,
  displayName: string
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
  title: string,
  regexp: string
}

export type FormattedFavoriteType = FavoriteType & {
  isSelected: boolean
}

export type MenuType = {

}
