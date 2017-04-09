// @flow
import React from 'react'
import {Link} from 'react-router'
import {observer} from 'mobx-react'

import {dataStore} from '../store'
import AppLinks from './AppLinks'
import logo from '../assets/logo.png'
import css from '../styles/Footer.scss'
import Text from './Text'

@observer
export default class Footer extends React.PureComponent {
  render() {
    return (
      <footer className={css.container}>
        <nav>
          <Link to="/contact" activeClassName={css.current}><Text id="contact" /></Link>
          <Link to="/privacy-policy" activeClassName={css.current}><Text id="privacyPolicy" /></Link>
          <a href="https://beta.kanttiinit.fi/" target="_blank">Beta</a>
          {dataStore.user && dataStore.user.admin &&
          <a href="/admin" target="_blank">Admin</a>}
        </nav>
        <AppLinks style={{marginTop: '2rem'}} />
        <div className={css.bottomRow}>
          <div className={css.logo}>
            <img src={logo} />
            <div>
              <h1>Kanttiinit{window.isBeta && <sup>BETA</sup>}</h1>
              <Text id="slogan" />
            </div>
          </div>
          <a href="https://github.com/Kanttiinit/web" target="_blank">{version}</a>
        </div>
      </footer>
    )
  }
}
