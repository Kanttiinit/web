import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { IoArrowLeftC, IoArrowRightC } from 'react-icons/lib/io'

import { setDayOffset } from '../store/actions/values';

const getDayString = (dayOffset, format) => {
  return moment().add(dayOffset, 'day').locale('fi').format(format).toUpperCase()
}

const canSetDay = (dayOffset, delta) => {
  return dayOffset + delta >= 0 && dayOffset + delta <= 7
}

const DaySelector = ({ dayOffset, setDayOffset }) => {
  return (
    <div className="dayselector">
      <div className="dayselector-controls">
        <button
          className={!canSetDay(dayOffset, -1) ? 'button-disabled': ''}
          disabled={!canSetDay(dayOffset, -1)}
          onClick={() => setDayOffset(dayOffset - 1)}>
          <p>{getDayString(dayOffset - 1, 'dddd')}</p>
        </button>
        <h1 className="dayselector-header">{getDayString(dayOffset, 'dddd, D.M.')}</h1>
        <button
          className={!canSetDay(dayOffset, 1) ? 'button-disabled' : ''}
          disabled={!canSetDay(dayOffset, 1)}
          onClick={() => setDayOffset(dayOffset + 1)}>
          <p>{getDayString(dayOffset + 1, 'dddd')}</p>
        </button>
      </div>
    </div>
  )
}

const mapState = state => ({
  dayOffset: state.value.dayOffset
})

const mapDispatchToProps = dispatch => bindActionCreators({ setDayOffset }, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
