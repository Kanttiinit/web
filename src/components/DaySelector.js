// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import times from 'lodash/times'

import {uiState} from '../store'
import css from '../styles/DaySelector.scss'
import Text from './Text'

const focus = (e: Element) => {
  if (e) {
    const node = ReactDOM.findDOMNode(e)
    if (node instanceof HTMLElement) {
      node.focus()
    }
  }
}

class DayLink extends React.PureComponent {
  render() {
    const {day, selectedDay, root} = this.props
    const search = moment().isSame(day, 'day') ? '' : `?day=${day.format('YYYY-MM-DD')}`
    const active = selectedDay.isSame(day, 'day')

    return (
      <Link
        ref={active && focus}
        className={active ? css.selected : ''}
        to={{pathname: root, search}}>
        <Text moment={day} id="dd D.M." />
      </Link>
    )
  }
}

@observer
export default class DaySelector extends React.PureComponent {
  props: {|
    root: string
  |}

  render() {
    const date = uiState.day
    return (
      <div className={css.days}>
        {!uiState.isDateInRange(date) &&
          <DayLink day={date} selectedDay={date} />
        }
        {times(6, i =>
          <DayLink
            key={i}
            root={this.props.root}
            selectedDay={date}
            day={moment().add({day: i})} />
        )}
      </div>
    )
  }
}