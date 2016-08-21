import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { setDayOffset } from '../store/actions/values';

const getDayString = (dayOffset, format) =>
  moment().add(dayOffset, 'day').locale('fi').format(format).toUpperCase()

class DaySelector extends React.Component {
  componentDidMount() {
    this.firstButton.focus()
    this.listener = e => {
      const {setDayOffset, dayOffset} = this.props;
      switch (e.keyCode) {
        case 39:
          setDayOffset(dayOffset + 1)
          break
        case 37:
          setDayOffset(dayOffset - 1)
          break
      }
    }
    document.addEventListener('keydown', this.listener)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.listener)
  }
  render() {
    const { dayOffset, setDayOffset } = this.props
    return (
      <div className="dayselector">
        {_.times(6, i =>
        <button
          key={i}
          ref={e => {
            if (i === 0) {
              this.firstButton = e
            }
          }}
          className={i === dayOffset ? 'selected' : ''}
          onClick={() => setDayOffset(i)}>
          {getDayString(i, 'dd DD.MM.')}
        </button>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  dayOffset: state.value.dayOffset
})

const mapDispatchToProps = dispatch => bindActionCreators({ setDayOffset }, dispatch)

export default connect(mapState, mapDispatchToProps)(DaySelector)
