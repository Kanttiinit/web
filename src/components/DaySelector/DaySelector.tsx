import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import * as moment from 'moment'

import {uiState} from '../../store'
const css = require('./DaySelector.scss')
import Text from '../Text'

const focus = (e: Link) => {
  if (e) {
    const node = ReactDOM.findDOMNode(e)
    if (node instanceof HTMLElement) {
      node.focus()
    }
  }
}

class DayLink extends React.PureComponent {
  props: {
    day: moment.Moment,
    selectedDay: moment.Moment,
    root?: string
  }

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
export default class DaySelector extends React.Component {
  props: {
    root: string
  }

  render() {
    const selectedDay = uiState.selectedDay
    return (
      <div className={css.days}>
        {!uiState.isDateInRange(selectedDay) &&
          <DayLink day={selectedDay} selectedDay={selectedDay} />
        }
        {uiState.displayedDays.map(day =>
          <DayLink
            key={day.format('YYYY-MM-DD')}
            root={this.props.root}
            selectedDay={selectedDay}
            day={day} />
        )}
      </div>
    )
  }
}