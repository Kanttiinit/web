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

@observer
export default class DaySelector extends React.PureComponent {
  focus = (e: Element) => {
    if (e) {
      const node = ReactDOM.findDOMNode(e)
      if (node instanceof HTMLElement) {
        node.focus()
      }
    }
  }

  render() {
    const date = uiState.day
    return (
      <div className={css.days}>
        {times(6, i => {
          const day = moment().add({day: i})
          const active = date.isSame(day, 'day')
          return (
            <Link
              key={i}
              ref={active && this.focus}
              className={active ? css.selected : ''}
              to={{pathname: '/', search: `?day=${day.format('YYYY-MM-DD')}`}}>
              <Text moment={day} id="dd D.M." />
            </Link>
          )
        })}
      </div>
    )
  }
}