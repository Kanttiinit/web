// @flow
import React from 'react'
import moment from 'moment'
import {observer} from 'mobx-react'
import times from 'lodash/times'
import {Link} from 'react-router-dom'
import AreaIcon from 'react-icons/lib/md/map'
import SettingsIcon from 'react-icons/lib/md/settings'
import FI from '../../assets/fi.png'
import EN from '../../assets/en.png'

import {uiState, preferenceStore} from '../../store'
import css from '../../styles/DaySelector.scss'
import Text from '../Text'

@observer
export default class DaySelector extends React.PureComponent {
  toggleLanguage = () => {
    preferenceStore.toggleLanguage()
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.centered}>
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
            <AreaIcon size={18} />
            <Text id="selectArea" />
          </Link>
          <Link to="/settings" className={css.icon}>
            <SettingsIcon size={18} />
            <Text id="settings" />
          </Link>
          <a className={css.icon} onClick={this.toggleLanguage}>
            <img height={18} src={preferenceStore.lang === 'fi' ? FI : EN} />
          </a>
        </div>
      </div>
    )
  }
}