// @flow
import React from 'react'
import {observer} from 'mobx-react'
import Walk from 'react-icons/lib/md/directions-walk'
import Bike from 'react-icons/lib/md/directions-bike'
import Location from 'react-icons/lib/io/pin'
import Star from 'react-icons/lib/md/star'
import More from 'react-icons/lib/md/more'
import c from 'classnames'
import {Link} from 'react-router-dom'
import moment from 'moment'
import times from 'lodash/times'
import random from 'lodash/random'

import CourseList from '../CourseList'
import {preferenceStore, uiState} from '../../store'
import Text from '../Text'
import css from '../../styles/Restaurant.scss'

const Distance = ({distance}) => {
  const kilometers = distance > 1500
  return (
    <div className={css.meta}>
      {!distance ? <Location className="inline-icon" />
      : kilometers
      ? <Bike className="inline-icon" />
      : <Walk className="inline-icon" />}
      {!distance ? <Text id="locating" />
      : kilometers
      ? parseFloat(distance / 1000).toFixed(1)
      : Math.round(distance)}
      &nbsp;
      {distance && <Text id={kilometers ? 'kilometers' : 'meters'} />}
    </div>
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

@observer
export default class Restaurant extends React.PureComponent {
  toggleStar = () => {
    const {restaurant} = this.props
    preferenceStore.setRestaurantStarred(restaurant.id, !restaurant.isStarred)
  }
  render() {
    const {restaurant} = this.props
    const dayOfWeek = uiState.day.locale('fi').weekday()
    const isClosed = uiState.day.isSame(moment(), 'day') && !restaurant.isOpenNow
    return (
      <div className={c(css.container, {
        [css.empty]: restaurant.noCourses,
        [css.shut]: isClosed
      })}>
        <div className={css.header}>
          <h2>
            {restaurant.name}
            {preferenceStore.useLocation &&
            <Distance distance={restaurant.distance} />
            }
          </h2>
          <div className={css.meta} style={{textAlign: 'right'}}>
            {restaurant.openingHours[dayOfWeek] && restaurant.openingHours[dayOfWeek].replace('-', '–')}
            {isClosed && <Text id="restaurantClosed" style={{display: 'block'}} element="small" />}
          </div>
        </div>
        <CourseList className={css.body} courses={restaurant.courses} />
        <div className={css.restaurantActions}>
          <a
            onClick={this.toggleStar}
            style={{color: restaurant.isStarred ? '#e6c100' : undefined}}
            className={css.actionIcon}>
            <Star size={18} />
          </a>
          &nbsp;
          <Link
            className={css.actionIcon}
            to={{pathname: `/restaurant/${restaurant.id}`, search: location.search}}>
            <More size={18} />
          </Link>
        </div>
      </div>
    )
  }
}
