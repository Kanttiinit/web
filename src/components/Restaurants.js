import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

const getDayOfWeek = (dayOffset) => {
  return moment().add(dayOffset, 'day').locale('fi').weekday()
}

const formattedRestaurants = (dayOffset, restaurants, menus) => {
  let day = moment().add(dayOffset, 'day').format('YYYY-MM-DD')
  return _.orderBy(
      restaurants.map(restaurant => {
         const courses = _.get(menus, [restaurant.id, day], []);
         return {...restaurant, courses, noCourses: !courses.length};
      }),
   ['noCourses'])
}

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

const Restaurants = ({ loading, restaurants, menus, dayOffset }) => {
  return (
    <div className="restaurants">
      {loading ? "loading" :
        formattedRestaurants(dayOffset, restaurants, menus).map((data) =>
          <Restaurant key={data.id} restaurant={data} dayOfWeek={getDayOfWeek(dayOffset)}></Restaurant>
        )
      }
    </div>
  )
}

const mapState = state => ({
  loading: state.pending.menus || state.pending.restaurants,
  restaurants: state.data.restaurants,
  menus: state.data.menus,
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(Restaurants)
