import React from 'react'
import {connect} from 'react-redux'
import {IndexLink, Link} from 'react-router'

import AppLinks from './AppLinks'
import logo from '../assets/logo.png'
import css from '../styles/Footer.scss'
import Text from './Text'

const Footer = ({user}) => {
  return (
    <footer className={css.container}>
      <Link to="/" style={{marginBottom: '2rem', display: 'block'}}>
        <div className={css.logo}>
          <img src={logo} />
          <h1>Kanttiinit{window.isBeta && <sup>BETA</sup>}</h1>
        </div>
        <Text id="slogan" element="p" />
      </Link>
      <nav>
        <IndexLink to="/" activeClassName={css.current}><Text id="menus" /></IndexLink>
        <Link to="/contact" activeClassName={css.current}><Text id="contact" /></Link>
        <Link to="/privacy-policy" activeClassName={css.current}><Text id="privacyPolicy" /></Link>
        <Link to="/beta" activeClassName={css.current}>Beta</Link>
        <a href="https://github.com/Kanttiinit" target="_blank"><Text id="sourceCode" /></a>
        {user && user.admin &&
        <a href="/admin" target="_blank">Admin</a>}
        &nbsp;
        <span>{version}</span>
      </nav>
      <AppLinks style={{marginTop: '2rem'}} />
    </footer>
  )
}

const mapState = state => ({
  user: state.data.user
})

export default connect(mapState)(Footer)
