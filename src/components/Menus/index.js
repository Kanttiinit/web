import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'

import Filters from './Filters'
import DaySelector from './DaySelector'
import Loader from '../Loader'
import {getFormattedRestaurants, selectFiltersExpanded} from '../../store/selectors'
import RestaurantList from './RestaurantList'

const Menus = ({restaurants, dayOffset, loading, filtersExpanded}) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      {filtersExpanded && <Filters />}
      {loading ? <Loader /> :
      <RestaurantList
        restaurants={restaurants}
        dayOffset={dayOffset}
        dayOfWeek={dayOfWeek} />
      }
    </StickyContainer>
  )
}

const mapState = state => ({
  loading: !state.data.menus || !state.data.restaurants || !state.data.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset,
  filtersExpanded: selectFiltersExpanded(state)
})

export default connect(mapState)(Menus)
