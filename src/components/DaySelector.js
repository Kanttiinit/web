import React from 'react'
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux'

import { setDayOffset } from '../store/actions/values';

let Dummy = ({ setDayOffset }) => {
  return (
    <div className="day-selector">
      <button onClick={setDayOffset(-1)}>-</button>
      <button onClick={setDayOffset(1)}>+</button>
    </div>
  )
}

// const mapDispatch = dispatch => bindActionCreators({ setDayOffset }, dispatch)

const mapDispatchToProps = (dispatch) => {
  return {
    setDayOffset: (value) => {
      dispatch(setDayOffset(value))
    }
  }
}

const DaySelector = connect(mapDispatchToProps)(Dummy)

export default DaySelector
