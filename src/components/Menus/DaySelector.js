import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import Account from 'react-icons/lib/md/settings'
import Map from 'react-icons/lib/md/map'
import times from 'lodash/times'
import {Link} from 'react-router'

import Tooltip from '../Tooltip'
import css from '../../styles/DaySelector.scss'
import {setDayOffset} from '../../store/actions/values'
import {isLoggedIn} from '../../store/selectors'
import Text from '../Text'

const DaySelector = ({ dayOffset, setDayOffset, user, isLoggedIn }) => (
  <div className={css.container}>
    <div className={css.days}>
      {times(6, i =>
      <button
        key={i}
        ref={e => i === dayOffset && e && e.focus()}
        className={i === dayOffset ? css.selected : ''}
        onClick={() => setDayOffset(i)}>
        <Text moment={moment().add(i, 'day')} id="dd DD.MM." />
      </button>
      )}
    </div>
    <Link to="/select-area" className={css.icon}>
      <Text id="selectArea" />
      <Map size={24} />
    </Link>
    <Link to="/settings" className={css.icon}>
      <Text id="settings" />
      {isLoggedIn ? <img src={user.photo} /> : <Account size={24} />}
    </Link>
  </div>
)

const mapState = state => ({
  dayOffset: state.value.dayOffset,
  user: state.data.user,
  isLoggedIn: isLoggedIn(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({setDayOffset}, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
