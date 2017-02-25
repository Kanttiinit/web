// @flow
import React from 'react'
import {connect} from 'react-redux'
import Error from 'react-icons/lib/md/error'
import times from 'lodash/times'

import Text from '../Text'
import css from '../../styles/RestaurantList.scss'
import Restaurant, {Placeholder} from './Restaurant'

const RestaurantList = ({restaurants, dayOffset, loading}) => (
  <div className={css.container}>
    {loading ? times(6, i => <Placeholder key={i} />)
    : !restaurants.length?
      <div className={css.emptyText}>
        <Error className="inline-icon" />&nbsp;
        <Text id="emptyRestaurants" />
      </div>
    : restaurants.map(restaurant =>
    <Restaurant
      key={restaurant.id}
      restaurant={restaurant}
      dayOffset={dayOffset} />
    )}
  </div>
)

const mapState = state => ({
  loading: !state.data.menus || !state.data.restaurants || !state.data.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(RestaurantList)
