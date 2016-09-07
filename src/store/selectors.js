import {createSelector} from 'reselect'
import moment from 'moment'
import _ from 'lodash'

export const selectAreas = state => state.data.areas || []

export const selectSelectedArea = createSelector(
  selectAreas,
  state => state.preferences.selectedArea,
  (areas, selectedArea) => areas.find(a => a.id === selectedArea)
)

export const getFormattedRestaurants = createSelector(
  state => state.value.dayOffset,
  state => state.data.restaurants || [],
  state => state.data.menus,
  selectSelectedArea,
  (dayOffset, restaurants, menus, selectedArea = {}) => {
    const day = moment().add(dayOffset, 'day').format('YYYY-MM-DD')
    return _.orderBy(
        restaurants
        .filter(restaurant =>
          selectedArea.restaurants && selectedArea.restaurants.some(r => r.id === restaurant.id))
        .map(restaurant => {
           const courses = _.get(menus, [restaurant.id, day], [])
           return {...restaurant, courses, noCourses: !courses.length}
        }),
     ['noCourses'])
  }
)

export const selectLang = state => state.preferences.lang

export const selectFiltersExpanded = createSelector(
  state => state.preferences.selectedArea,
  state => state.preferences.filtersExpanded,
  (selectedArea, filtersExpanded) => !selectedArea || filtersExpanded
)

export const isLoggedIn = createSelector(
  state => state.preferences.authData,
  authData => !!authData
)
