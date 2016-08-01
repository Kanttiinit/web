import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { IoArrowLeftB, IoArrowRightB } from 'react-icons/lib/io'

import { setDayOffset } from '../store/actions/values';

const getDayString = (dayOffset) => {
  return moment().add(dayOffset, 'day').locale('fi').format('dddd, Do MMMM') + 'ta' // :----D
}

const DaySelector = ({ dayOffset, setDayOffset }) => {
  return (
    <div className="dayselector">
      <h1 className="dayselector-header">{getDayString(dayOffset)}</h1>
      <div className="dayselector-controls">
        <button onClick={() => setDayOffset(dayOffset - 1)}>
          <IoArrowLeftB size={24}/>
        </button>
        <button onClick={() => setDayOffset(dayOffset + 1)}>
          <IoArrowRightB size={24}/>
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
