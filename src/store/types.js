// @flow
export type UserType = {
  name: string,
  email: string
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

}

export type MenuType = {

}
