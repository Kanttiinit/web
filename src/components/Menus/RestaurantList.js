import React from 'react'

import css from '../../styles/RestaurantList.scss'
import Restaurant from './Restaurant'

const RestaurantList = ({restaurants, dayOfWeek}) => (
  <div className={css.container}>
    {restaurants.map(restaurant =>
    <Restaurant
      key={restaurant.id}
      restaurant={restaurant}
      dayOfWeek={dayOfWeek} />
    )}
  </div>
)

export default RestaurantList
