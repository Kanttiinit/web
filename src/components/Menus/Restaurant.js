import React from 'react'
import { connect } from 'react-redux'
import Walk from 'react-icons/lib/md/directions-walk'
import Map from 'react-icons/lib/io/more'
import Star from 'react-icons/lib/io/star'
import c from 'classnames'

import Text from '../Text'
import css from '../../styles/Restaurant.scss'
import {openModal} from '../../store/actions/values'
import {setRestaurantStarred} from '../../store/actions/preferences'
import RestaurantModal from '../RestaurantModal'

const Restaurant = ({ restaurant, dayOffset, dayOfWeek, openModal, toggleStar }) => {
  const isClosed = dayOffset === 0 && !restaurant.isOpenNow
  return (
    <div className={c({
      [css.container]: true,
      [css.empty]: restaurant.noCourses,
      [css.shut]: isClosed
    })}>
      <div className={css.header}>
        <h2>
          {restaurant.name}
          {restaurant.distance &&
          <div className={css.meta}>
            <Walk className="inline-icon" />{Math.round(restaurant.distance)} meters
          </div>
          }
        </h2>
        <div className={css.meta} style={{textAlign: 'right'}}>
          {restaurant.openingHours[dayOfWeek].replace('-', '–')}<br />
          {isClosed && <small><Text id="restaurantClosed" /></small>}
        </div>
      </div>
      <div className={css.body}>
        {restaurant.noCourses ? (<span className={css.emptyText}>{<Text id="noMenu" />}</span>) : restaurant.courses.map((course, i) => (
          <div
            className={css.course}
            key={i}>
            <span className={css.title}>{course.title}</span>
            <span className={css.props}>{course.properties.join(' ')}</span>
          </div>
        ))}
      </div>
      <div className={css.restaurantActions}>
        <a onClick={() => toggleStar()} className={css.actionIcon}>
          <Star size={18} color={restaurant.isStarred ? '#FFD600' : undefined} />
        </a>
        &nbsp;
        <a onClick={() => openModal()} className={css.actionIcon}>
          <Map size={18}/>
        </a>
      </div>
    </div>
  )
}

const mapDispatch = (dispatch, props) => ({
  openModal: () => dispatch(openModal(<RestaurantModal restaurant={props.restaurant} />)),
  toggleStar() {
    dispatch(setRestaurantStarred(props.restaurant.id, !props.restaurant.isStarred))
  }
})

export default connect(null, mapDispatch)(Restaurant)
