import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'
import sortBy from 'lodash/sortBy'

import DaySelector from './DaySelector'
import AreaSelector from './AreaSelector'
import Loader from '../Loader'
import {getFormattedRestaurants, selectFiltersExpanded} from '../../store/selectors'
import RestaurantList from './RestaurantList'

const Areas = ({restaurants, dayOffset, loading, filtersExpanded}) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      {filtersExpanded &&
      <div>
        <AreaSelector style={{textAlign: 'center', padding: '1.5rem 0 0.5rem'}} />
      </div>
      }
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
  dayOffset: state.value.dayOffset,
  filtersExpanded: selectFiltersExpanded(state)
})

export default connect(mapState)(Areas)
