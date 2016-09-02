import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import Settings from 'react-icons/lib/md/settings'

import { setDayOffset } from '../../store/actions/values';
import Text from '../Text'

const DaySelector = ({ dayOffset, setDayOffset }) => (
  <div className="dayselector">
    {_.times(6, i =>
    <button
      key={i}
      ref={e => i === 0 && e && e.focus()}
      className={i === dayOffset ? 'selected' : ''}
      onClick={() => setDayOffset(i)}>
      <Text moment={moment().add(i, 'day')} id="dd DD.MM." />
    </button>
    )}
    <a className="settings-icon" href="/settings">
      <Settings size={24} />
    </a>
  </div>
)

const mapState = state => ({
  dayOffset: state.value.dayOffset
})

const mapDispatchToProps = dispatch => bindActionCreators({ setDayOffset }, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
