import React from 'react'
import { connect } from 'react-redux'
import Walk from 'react-icons/lib/md/directions-walk'

import css from '../../styles/Restaurant.scss'
import {openModal} from '../../store/actions/values'
import RestaurantModal from '../RestaurantModal'

const Restaurant = ({ restaurant, dayOfWeek, openModal }) => (
  <div className={css.container + (restaurant.noCourses ? ' ' + css.empty : '')}>
    <div onClick={() => openModal()} className={css.header}>
      <h2>
        {restaurant.name}
        {restaurant.distance &&
        <div className={css.meta}>
          <Walk className="inline-icon" />{Math.round(restaurant.distance)} meters
        </div>
        }
      </h2>
      <div className={css.meta}>
        {restaurant.openingHours[dayOfWeek]}
      </div>
    </div>
    <div className={css.body}>
      {restaurant.noCourses ? (<span className={css.emptyText}>Ei ruokaa</span>) : restaurant.courses.map((course, i) => (
        <div
          className={css.course}
          key={i}>
          <span className={css.title}>{course.title}</span>
          <span className={css.props}>{course.properties.join(" ")}</span>
        </div>
      ))}
    </div>
  </div>
)

const mapDispatch = (dispatch, props) => ({
  openModal: () => dispatch(openModal(<RestaurantModal restaurant={props.restaurant} />))
})

export default connect(null, mapDispatch)(Restaurant)
