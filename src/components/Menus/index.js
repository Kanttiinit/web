import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'

import css from '../../styles/Menus.scss'
import DaySelector from './DaySelector'
import AreaSelector from './AreaSelector'
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
      {filtersExpanded &&
      <div className={css.filters}>
        <AreaSelector />
      </div>
      }
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
