import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {getFormattedRestaurants} from '../store/selectors'

const Restaurant = ({ restaurant, dayOfWeek }) => {
  return (
    <div className={"restaurant" + (restaurant.noCourses ? ' restaurant-empty' : '')}>
      <div className="restaurant-header">
        <h2>{restaurant.name}</h2>
        <span>{restaurant.openingHours[dayOfWeek]}</span>
      </div>
      <div className="restaurant-body">
        {restaurant.noCourses ? (<span className="restaurant-empty-text">Ei ruokaa</span>) : restaurant.courses.map((course) => (
          <div
            className={"restaurant-course" + (restaurant.courses[restaurant.courses.length - 1].title === course.title ? ' last-course' : '')}
            key={course.title}>
            <span className="course-title">{course.title}</span>
            <span className="course-props">{course.properties.join(" ")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const Restaurants = ({ loading, restaurants, dayOffset }) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <div className="restaurants">
      {loading ? "loading" :
        restaurants.map(restaurant =>
          <Restaurant
            key={restaurant.id}
            restaurant={restaurant}
            dayOfWeek={dayOfWeek} />
        )
      }
    </div>
  )
}

const mapState = state => ({
  loading: state.pending.menus || state.pending.restaurants,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(Restaurants)
