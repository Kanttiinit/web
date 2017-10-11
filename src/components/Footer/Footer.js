// @flow
import React from 'react'
import {NavLink} from 'react-router-dom'
import {observer} from 'mobx-react'
import {withRouter} from 'react-router-dom'

import logo from '../../assets/logo.png'
import css from './Footer.scss'
import Text from '../Text'

@observer
export default withRouter(class Footer extends React.Component {
  render() {
    const {search} = this.props.location
    return (
      <footer className={css.container}>
        <div className={css.bottomRow}>
          <div className={css.logo}>
            <img src={logo} />
            <nav>
              <NavLink to={{pathname: '/contact', search}} activeClassName={css.current}>
                <Text id="contact" />
              </NavLink>
              <NavLink to={{pathname: '/clients', search}}>
                <Text id="otherClients" />
              </NavLink>
              <NavLink to={{pathname: '/privacy-policy', search}} activeClassName={css.current}>
                <Text id="privacyPolicy" />
              </NavLink>
              {!window.isBeta && <a href="https://beta.kanttiinit.fi/" target="_blank">Beta</a>}
            </nav>
          </div>
          <a href="https://github.com/Kanttiinit/web" target="_blank">{version}</a>
        </div>
      </footer>
    )
  }
})
