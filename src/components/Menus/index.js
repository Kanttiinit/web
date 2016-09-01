import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'
import sortBy from 'lodash/sortBy'

import DaySelector from './DaySelector'
import AreaSelector from './AreaSelector'
import Loader from '../Loader'
import {getFormattedRestaurants} from '../../store/selectors'
import RestaurantList from './RestaurantList'

const Areas = ({restaurants, dayOffset, loading}) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      <AreaSelector />
      {loading ? <Loader /> :
      <RestaurantList
        restaurants={restaurants}
        dayOfWeek={dayOfWeek} />
      }
    </StickyContainer>
  )
}

const mapState = state => ({
  loading: state.pending.menus || state.pending.restaurants || state.pending.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(Areas)
