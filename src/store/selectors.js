import {createSelector} from 'reselect'
import moment from 'moment'
import _ from 'lodash'
import haversine from 'haversine'
import {Set} from 'immutable'

export const selectAreas = state => state.data.areas || []

export const selectSelectedArea = createSelector(
  selectAreas,
  state => state.preferences.selectedArea,
  (areas, selectedArea) => areas.find(a => a.id === selectedArea)
)

export const starredRestaurants = state => state.preferences.starredRestaurants || Set()

export const getFormattedRestaurants = createSelector(
  state => state.value.dayOffset,
  state => state.data.restaurants || [],
  state => state.data.menus,
  selectSelectedArea,
  state => state.value.location,
  starredRestaurants,
  (dayOffset, restaurants, menus, selectedArea = {}, location, starredRestaurants) => {
    const day = moment().add(dayOffset, 'day')
    return _.orderBy(
        restaurants
        .filter(restaurant =>
          selectedArea.restaurants && selectedArea.restaurants.some(r => r.id === restaurant.id))
          .map(restaurant => {
            const courses = _.get(menus, [restaurant.id, day.format('YYYY-MM-DD')], [])
            const distance = location && haversine(location, restaurant, {unit: 'meter'})
            const isOpenNow = (restaurant.openingHours[day.locale('fi').weekday()]) ?
              Number(moment().format('HHMM')) < Number(restaurant.openingHours[day.locale('fi').weekday()].split('-')[1].replace(':', ''))
              : undefined
            return {
              ...restaurant,
              courses,
              distance,
              noCourses: !courses.length, isOpenNow,
              isStarred: starredRestaurants.includes(restaurant.id)
            }
          }),
     ['noCourses', 'isStarred', 'distance'], ['asc', 'desc', 'desc'])
  }
)

export const selectLang = state => state.preferences.lang

export const selectFiltersExpanded = createSelector(
  state => state.preferences.filtersExpanded,
  filtersExpanded => filtersExpanded
)

export const isLoggedIn = createSelector(
  state => state.preferences.token,
  state => state.data.user,
  (token, user) => token && user
)
