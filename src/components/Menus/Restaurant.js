// @flow
import React from 'react'
import { connect } from 'react-redux'
import Walk from 'react-icons/lib/md/directions-walk'
import Bike from 'react-icons/lib/md/directions-bike'
import Map from 'react-icons/lib/fa/plus'
import Star from 'react-icons/lib/io/star'
import Heart from 'react-icons/lib/io/heart'
import c from 'classnames'
import {Link} from 'react-router'
import moment from 'moment'
import times from 'lodash/times'
import random from 'lodash/random'

import Text from '../Text'
import css from '../../styles/Restaurant.scss'

const Distance = ({distance}) => {
  const kilometers = distance > 1500
  return (
    <span>
      {kilometers
      ? <Bike className="inline-icon" />
      : <Walk className="inline-icon" />}
      {kilometers
      ? parseFloat(distance / 1000).toFixed(1)
      : Math.round(distance)}
      &nbsp;
      <Text id={kilometers ? 'kilometers' : 'meters'} />
    </span>
  )
}

export class Placeholder extends React.Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    return (
      <div className={css.container + ' ' + css.placeholder}>
        <div className={css.header} style={{width: random(30, 70) + '%'}}></div>
        <div className={css.body}>
          {times(10, i => <div key={i} className={css.course} style={{width: random(40, 100) + '%'}}></div>)}
        </div>
      </div>
    )
  }
}

const Restaurant = ({ restaurant, dayOffset, toggleStar }) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
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
            <Distance distance={restaurant.distance} />
          </div>
          }
        </h2>
        <div className={css.meta} style={{textAlign: 'right'}}>
          {restaurant.openingHours[dayOfWeek] && restaurant.openingHours[dayOfWeek].replace('-', '–')}
          {isClosed && <Text id="restaurantClosed" style={{display: 'block'}} element="small" />}
        </div>
      </div>
      <div className={css.body}>
        {restaurant.noCourses ? (<span className={css.emptyText}>{<Text id="noMenu" />}</span>) : restaurant.courses.map((course, i) => (
          <div
            className={`${css.course} ${course.isFavorite ? css.favoriteCourse : ''}`}
            key={i}>
            {course.isFavorite && <Heart className={`inline-icon ${css.icon}`} />}
            <span className={css.title}>{course.title}</span>
            <span className={css.props}>{course.properties.join(' ')}</span>
          </div>
        ))}
      </div>
      <div className={css.restaurantActions}>
        <a
          onClick={() => toggleStar()}
          style={{color: restaurant.isStarred ? '#e6c100' : undefined}}
          className={css.actionIcon}>
          <Star className="inline-icon" />
          <Text id={restaurant.isStarred ? 'removeStar' : 'addStar'} />
        </a>
        &nbsp;
        <Link className={css.actionIcon} to={`/restaurant/${restaurant.id}`}>
          <Map className="inline-icon" /> <Text id="moreInfo" />
        </Link>
      </div>
    </div>
  )
}

const mapDispatch = (dispatch, props) => ({
  toggleStar() {
    dispatch(setRestaurantStarred(props.restaurant.id, !props.restaurant.isStarred))
  }
})

export default connect(null, mapDispatch)(Restaurant)
