import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { setDayOffset } from '../store/actions/values';

const getDayString = (dayOffset, format) =>
  moment().add(dayOffset, 'day').locale('fi').format(format).toUpperCase()

const DaySelector = ({ dayOffset, setDayOffset }) => {
  return (
    <div className="dayselector">
      {_.times(6, i =>
      <button
        key={i}
        className={i === dayOffset ? 'selected' : ''}
        onClick={() => setDayOffset(i)}>
        {getDayString(i, 'dd DD.MM.')}
      </button>
      )}
    </div>
  )
}

const mapState = state => ({
  dayOffset: state.value.dayOffset
})

const mapDispatchToProps = dispatch => bindActionCreators({ setDayOffset }, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
