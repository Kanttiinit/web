// @flow
import React from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import AreaIcon from 'react-icons/lib/md/map'
import SettingsIcon from 'react-icons/lib/md/settings'
import FI from '../../assets/fi.png'
import EN from '../../assets/en.png'

import DaySelector from '../DaySelector'
import {preferenceStore} from '../../store'
import css from '../../styles/TopBar.scss'
import Text from '../Text'

@observer
export default class TopBar extends React.PureComponent {
  toggleLanguage = () => {
    preferenceStore.toggleLanguage()
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.centered}>
          <DaySelector />
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
