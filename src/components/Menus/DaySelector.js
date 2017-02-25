// @flow
import React from 'react'
import moment from 'moment'
import {observer} from 'mobx-react'
import Account from 'react-icons/lib/md/settings'
import Map from 'react-icons/lib/md/map'
import times from 'lodash/times'
import {Link} from 'react-router'

import {uiState, dataStore} from '../../store'
import css from '../../styles/DaySelector.scss'
import Text from '../Text'

@observer
export default class DaySelector extends React.PureComponent {
  render() {
    return (
      <div className={css.container}>
        <div className={css.days}>
          {times(6, i =>
          <button
            key={i}
            ref={e => i === uiState.dayOffset && e && e.focus()}
            className={i === uiState.dayOffset ? css.selected : ''}
            onClick={() => uiState.dayOffset = i}>
            <Text moment={moment().add(i, 'day')} id="dd DD.MM." />
          </button>
          )}
        </div>
        <Link to="/select-area" className={css.icon}>
          <Text id="selectArea" />
          <Map size={24} />
        </Link>
        <Link to="/settings" className={css.icon}>
          <Text id="settings" />
          {dataStore.user ? <img src={dataStore.user.photo} /> : <Account size={24} />}
        </Link>
      </div>
    )
  }
}