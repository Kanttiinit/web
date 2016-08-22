import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'

import DaySelector from './DaySelector'
import Loader from './Loader'
import {getFormattedRestaurants} from '../store/selectors'

const Restaurant = ({ restaurant, dayOfWeek }) => (
  <div className={"restaurant" + (restaurant.noCourses ? ' restaurant-empty' : '')}>
    <div className="restaurant-header">
      <h2><a href={restaurant.url} target="_blank">{restaurant.name}</a></h2>
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

const Restaurants = ({area, restaurants, dayOfWeek}) => (
  <div className="area-restaurants">
    <h1>{area.name}</h1>
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

const Areas = ({restaurants, areas, dayOffset, loading}) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      {loading || !areas ? <Loader /> :
        areas.map(area =>
          <Restaurants
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
