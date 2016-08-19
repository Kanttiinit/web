import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { IoArrowLeftC, IoArrowRightC } from 'react-icons/lib/io'

import { setDayOffset } from '../store/actions/values';

const getDayString = (dayOffset) => {
  return moment().add(dayOffset, 'day').locale('fi').format('dddd, D.M.')
}

const DaySelector = ({ dayOffset, setDayOffset }) => {
  return (
    <div className="dayselector">
      <div className="dayselector-controls">
        <button onClick={() => setDayOffset(dayOffset - 1)}>
          <IoArrowLeftC size={24}/>
        </button>
        <h1 className="dayselector-header">{getDayString(dayOffset).toUpperCase()}</h1>
        <button onClick={() => setDayOffset(dayOffset + 1)}>
          <IoArrowRightC size={24}/>
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
