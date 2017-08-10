// @flow
import React from 'react'
import moment from 'moment'
import times from 'lodash/times'

import css from '../styles/DaySelector.scss'
import Text from './Text'

export default class DaySelector extends React.PureComponent {
  props: {
    dayOffset: number,
    onChange: number => void
  }

  render() {
    const {dayOffset, onChange} = this.props

    return (
      <div className={css.days}>
        {times(6, i =>
        <button
          key={i}
          ref={e => i === dayOffset && e && e.focus()}
          className={i === dayOffset ? css.selected : ''}
          onClick={() => onChange(i)}>
          <Text moment={moment().add(i, 'day')} id="dd D.M." />
        </button>
        )}
      </div>
    )
  }
}