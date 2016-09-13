import React from 'react'
import { connect } from 'react-redux'

import css from '../../styles/Restaurant.scss'
import {openModal} from '../../store/actions/values'
import RestaurantModal from '../RestaurantModal'
import Map from 'react-icons/lib/io/more'

const Restaurant = ({ restaurant, dayOfWeek, openModal }) => (
  <div className={css.container + (restaurant.noCourses ? ' ' + css.empty : '')}>
    <div className={css.header}>
      <h2>{restaurant.name}</h2>
      <span>{restaurant.openingHours[dayOfWeek]}</span>
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
    <div className={css.restaurantActions}>
      <a onClick={() => openModal()} className={css.actionIcon}>
        <Map size={18}/>
      </a>
    </div>
  </div>
)

const mapDispatch = (dispatch, props) => ({
  openModal: () => dispatch(openModal(<RestaurantModal restaurant={props.restaurant} />))
})

export default connect(null, mapDispatch)(Restaurant)
