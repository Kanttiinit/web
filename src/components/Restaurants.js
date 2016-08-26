import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'

import DaySelector from './DaySelector'
import RestaurantModal from './RestaurantModal'
import Loader from './Loader'
import {getFormattedRestaurants} from '../store/selectors'
import {openModal} from '../store/actions/values'

const Restaurant = ({ restaurant, dayOfWeek, openModal }) => (
  <div className={"restaurant" + (restaurant.noCourses ? ' restaurant-empty' : '')}>
    <div onClick={() => openModal()} className="restaurant-header">
      <h2>{restaurant.name}</h2>
      <span>{restaurant.openingHours[dayOfWeek]}</span>
    </div>
    <div className="restaurant-body">
      {restaurant.noCourses ? (<span className="restaurant-empty-text">Ei ruokaa</span>) : restaurant.courses.map((course, i) => (
        <div
          className={"restaurant-course" + (restaurant.courses[restaurant.courses.length - 1].title === course.title ? ' last-course' : '')}
          key={i}>
          <span className="course-title">{course.title}</span>
          <span className="course-props">{course.properties.join(" ")}</span>
        </div>
      ))}
    </div>
  </div>
)

const ConnecedRestaurant = connect(null, (dispatch, props) => ({
  openModal: () => dispatch(openModal(<RestaurantModal restaurant={props.restaurant} />))
}))(Restaurant)

const Restaurants = ({area, restaurants, dayOfWeek}) => (
  <div className="area-restaurants">
    <h1>{area.name}</h1>
    <div className="restaurants">
      {restaurants.map(restaurant =>
      <ConnecedRestaurant
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
