import * as React from 'react'
import {withRouter} from 'react-router-dom'
import { RouteComponentProps } from 'react-router';
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import * as AreaIcon from 'react-icons/lib/md/map'
import * as SettingsIcon from 'react-icons/lib/md/settings'
const FI = require('../../assets/fi.png')
const EN = require('../../assets/en.png')

import DaySelector from '../DaySelector'
import {preferenceStore} from '../../store'
const css = require('./TopBar.scss')
import Text from '../Text'

export default withRouter(observer(class TopBar extends React.Component {
  props: RouteComponentProps<any>

  toggleLanguage = () => {
    preferenceStore.toggleLanguage()
  }

  render() {
    const {search} = this.props.location
    return (
      <div className={css.container}>
        <div className={css.centered}>
          <DaySelector root="/" />
          <Link to={{pathname: '/select-area', search}} className={css.icon}>
            <AreaIcon size={18} />
            <Text id="selectArea" />
          </Link>
          <Link to={{pathname: '/settings', search}} className={css.icon}>
            <SettingsIcon size={18} />
            <Text id="settings" />
          </Link>
          <a className={css.icon} onClick={this.toggleLanguage}>
            <img height={18} alt={preferenceStore.lang.toUpperCase()} src={preferenceStore.lang === 'fi' ? FI : EN} />
          </a>
        </div>
      </div>
    )
  }
}))
