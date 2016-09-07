import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import Account from 'react-icons/lib/md/account-circle'
import More from 'react-icons/lib/md/expand-more'

import Loader from '../Loader'
import {setDayOffset} from '../../store/actions/values'
import {setFiltersExpanded} from '../../store/actions/preferences'
import {selectFiltersExpanded, isLoggedIn} from '../../store/selectors'
import Text from '../Text'

const DaySelector = ({ dayOffset, setDayOffset, setFiltersExpanded, filtersExpanded, user, isLoggedIn }) => (
  <div className="dayselector">
    <a
      onClick={() => setFiltersExpanded(!filtersExpanded)}
      className={'filters-icon' + (filtersExpanded ? ' expanded' : '')}>
      <More size={24} />
    </a>
    {_.times(6, i =>
    <button
      key={i}
      ref={e => i === dayOffset && e && e.focus()}
      className={i === dayOffset ? 'selected' : ''}
      onClick={() => setDayOffset(i)}>
      <Text moment={moment().add(i, 'day')} id="dd DD.MM." />
    </button>
    )}
    <a className="account-icon" href="/settings">
      {isLoggedIn ? (user ? <img src={user.photo} /> : <Loader />) : <Account size={24} />}
    </a>
  </div>
)

const mapState = state => ({
  dayOffset: state.value.dayOffset,
  filtersExpanded: selectFiltersExpanded(state),
  user: state.data.user,
  isLoggedIn: isLoggedIn(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({setDayOffset, setFiltersExpanded}, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
