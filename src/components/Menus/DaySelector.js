import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import Account from 'react-icons/lib/md/account-circle'
import More from 'react-icons/lib/md/expand-more'

import Settings from './Settings'
import css from '../../styles/DaySelector.scss'
import Loader from '../Loader'
import {setDayOffset, openModal} from '../../store/actions/values'
import {setFiltersExpanded} from '../../store/actions/preferences'
import {selectFiltersExpanded, isLoggedIn} from '../../store/selectors'
import Text from '../Text'

const DaySelector = ({ dayOffset, setDayOffset, openModal, setFiltersExpanded, filtersExpanded, user, isLoggedIn }) => (
  <div className={css.container}>
    <a
      onClick={() => setFiltersExpanded(!filtersExpanded)}
      className={css.filtersIcon + (filtersExpanded ? ' ' + css.expanded : '')}>
      <More size={24} />
    </a>
    <div className="hide-mobile">
      {_.times(6, i =>
      <button
        key={i}
        ref={e => i === dayOffset && e && e.focus()}
        className={i === dayOffset ? css.selected : ''}
        onClick={() => setDayOffset(i)}>
        <Text moment={moment().add(i, 'day')} id="dd DD.MM." />
      </button>
      )}
    </div>
    <select className="show-mobile" value={dayOffset} onChange={event => setDayOffset(event.target.value)}>
      {_.times(6, i =>
        <option key={i} value={i}>
          <Text moment={moment().add(i, 'day')} id="dddd DD.MM." />
        </option>
      )}
    </select>
    <a className={css.accountIcon} onClick={() => openModal(<Settings />)}>
      {isLoggedIn ? <img src={user.photo} /> : <Account size={24} />}
    </a>
  </div>
)

const mapState = state => ({
  dayOffset: state.value.dayOffset,
  filtersExpanded: selectFiltersExpanded(state),
  user: state.data.user,
  isLoggedIn: isLoggedIn(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({setDayOffset, openModal, setFiltersExpanded}, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
