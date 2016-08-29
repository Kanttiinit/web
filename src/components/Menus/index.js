import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'

import DaySelector from './DaySelector'
import Loader from '../Loader'
import {getFormattedRestaurants} from '../../store/selectors'
import Area from './Area'

const Areas = ({restaurants, areas, dayOffset, loading}) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      {loading || !areas ? <Loader /> :
        areas.map(area =>
          <Area
            key={area.id}
            area={area}
            restaurants={restaurants.filter(r => {
              const restaurantIds = area.restaurants.map(r => r.id)
              return restaurantIds.includes(r.id)
            })}
            dayOfWeek={dayOfWeek} />
        )
      }
    </StickyContainer>
  )
}

const mapState = state => ({
  loading: state.pending.menus || state.pending.restaurants || state.pending.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset,
  areas: state.data.areas
})

export default connect(mapState)(Areas)
