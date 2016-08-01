import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

const formattedRestaurants = (dayOffset, restaurants, menus) => {
  let day = moment().add(dayOffset, 'day').format('YYYY-MM-DD')
  const asd = _.orderBy(
      restaurants.map(restaurant => {
         const courses = _.get(menus, [restaurant.id, day], []);
         return {...restaurant, courses, noCourses: !courses.length};
      }),
   ['noCourses'])
  console.log(asd)
  return asd
}

const Restaurant = ({ restaurant }) => {
  return (
    <div className="restaurant">
      <div className="restaurant-header">
        <h2>{restaurant.name}</h2>
      </div>
      <div className="restaurant-body">
        {restaurant.noCourses ? (<span className="restaurant-empty">Ei ruokaa</span>) : restaurant.courses.map((course) => (
          <span className="restaurant-course" key={course.key}>{course.title}</span>
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
          <Restaurant key={data.id} restaurant={data}></Restaurant>
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
