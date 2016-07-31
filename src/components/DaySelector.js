import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setDayOffset } from '../store/actions/values';

const DaySelector = ({ setDayOffset }) => {
  return (
    <div className="day-selector">
      <button onClick={() => setDayOffset(-1)}>-</button>
      <button onClick={() => setDayOffset(1)}>+</button>
    </div>
  )
}

const mapDispatchToProps = dispatch => bindActionCreators({ setDayOffset }, dispatch)

export default connect(null, mapDispatchToProps)(DaySelector)
