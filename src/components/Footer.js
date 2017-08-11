// @flow
import React from 'react'
import {NavLink} from 'react-router-dom'
import {observer} from 'mobx-react'
import {withRouter} from 'react-router-dom'

import AppLinks from './AppLinks'
import logo from '../assets/logo.png'
import css from '../styles/Footer.scss'
import Text from './Text'

@observer
export default withRouter(class Footer extends React.PureComponent {
  render() {
    return (
      <footer className={css.container}>
        <AppLinks style={{marginTop: '2rem'}} />
        <div className={css.bottomRow}>
          <div className={css.logo}>
            <img src={logo} />
            <nav>
              <NavLink to={{pathname: '/contact', search: this.props.location.search}} activeClassName={css.current}><Text id="contact" /></NavLink>
              <NavLink to={{pathname: '/privacy-policy', search: this.props.location.search}} activeClassName={css.current}><Text id="privacyPolicy" /></NavLink>
              {!window.isBeta && <a href="https://beta.kanttiinit.fi/" target="_blank">Beta</a>}
            </nav>
          </div>
          <a href="https://github.com/Kanttiinit/web" target="_blank">{version}</a>
        </div>
      </footer>
    )
  }
})
