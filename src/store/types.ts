export interface RestaurantType {
  id: number,
  name: string,
  longitude: number,
  latitude: number,
  openingHours: Array<string>,
  address: string,
  url: string,
  isStarred: boolean,
  noCourses: boolean,
  isOpenNow: boolean,
  distance?: number,
  courses: CourseType[]
}

export interface AreaType {
  id: number,
  name: string,
  restaurants: Array<number>,
  mapImageUrl: string
}

export interface FavoriteType {
  id: number,
  name: string,
  regexp: string
}

export interface FormattedFavoriteType extends FavoriteType {
  isSelected: boolean
}

export interface MenuType {

}

export interface CourseType {
  title: string,
  properties: Array<string>,
  isFavorite: boolean,
  matchesSpecialDiet: boolean
}