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
        <Link to="/" style={{margin: '2rem 0 2rem', display: 'block'}}>
          <div className={css.logo}>
            <img src={logo} />
            <h1>Kanttiinit{window.isBeta && <sup>BETA</sup>}</h1>
          </div>
          <Text id="slogan" element="p" />
        </Link>
        <a href="https://github.com/Kanttiinit" target="_blank">{version}</a>
      </footer>
    )
  }
}
