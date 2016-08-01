import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setDayOffset } from '../store/actions/values';

const DaySelector = ({ dayOffset, setDayOffset }) => {
  return (
    <div className="day-selector">
      <button onClick={() => setDayOffset(dayOffset - 1)}>-</button>
      <button onClick={() => setDayOffset(dayOffset + 1)}>+</button>
    </div>
  )
}

const mapState = state => ({
  dayOffset: state.value.dayOffset
})

const mapDispatchToProps = dispatch => bindActionCreators({ setDayOffset }, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
