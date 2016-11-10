import React from 'react'
import { connect } from 'react-redux'

import DaySelector from './DaySelector'
import Loader from '../Loader'
import {getFormattedRestaurants} from '../../store/selectors'
import RestaurantList from './RestaurantList'

const Menus = ({restaurants, dayOffset, loading}) => {
  return (
    <div>
      <DaySelector />
      <div style={{paddingTop: '2rem'}}>
        {loading ? <Loader /> :
        <RestaurantList
          restaurants={restaurants}
          dayOffset={dayOffset} />
        }
      </div>
    </div>
  )
}

const mapState = state => ({
  loading: !state.data.menus || !state.data.restaurants || !state.data.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(Menus)
