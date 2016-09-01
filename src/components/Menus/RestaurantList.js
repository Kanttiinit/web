import React from 'react'

import Restaurant from './Restaurant'

const RestaurantList = ({restaurants, dayOfWeek}) => (
  <div className="area-restaurants">
    <div className="restaurants">
      {restaurants.map(restaurant =>
      <Restaurant
        key={restaurant.id}
        restaurant={restaurant}
        dayOfWeek={dayOfWeek} />
      )}
    </div>
  </div>
)

export default RestaurantList
