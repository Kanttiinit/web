import React from 'react'
import { connect } from 'react-redux'

import {openModal} from '../../store/actions/values'
import RestaurantModal from '../RestaurantModal'

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

const mapDispatch = (dispatch, props) => ({
  openModal: () => dispatch(openModal(<RestaurantModal restaurant={props.restaurant} />))
})

export default connect(null, mapDispatch)(Restaurant)
