import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'

import DaySelector from './DaySelector'
import Loader from '../Loader'
import {getFormattedRestaurants} from '../../store/selectors'
import RestaurantList from './RestaurantList'

const Menus = ({restaurants, dayOffset, loading}) => {
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      {loading ? <Loader /> :
      <RestaurantList
        restaurants={restaurants}
        dayOffset={dayOffset} />
      }
    </StickyContainer>
  )
}

const mapState = state => ({
  loading: !state.data.menus || !state.data.restaurants || !state.data.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(Menus)
