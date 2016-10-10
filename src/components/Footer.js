import React from 'react'
import {connect} from 'react-redux'
import {IndexLink, Link} from 'react-router'

import css from '../styles/Footer.scss'
import Text from './Text'

const Footer = ({user}) => {
  return (
    <footer className={css.container}>
      <IndexLink to="/" activeClassName={css.current}><Text id="menus" /></IndexLink>
      <Link to="/contact" activeClassName={css.current}><Text id="contact" /></Link>
      <Link to="/privacy-policy" activeClassName={css.current}><Text id="privacyPolicy" /></Link>
      <Link to="/beta" activeClassName={css.current}>Beta</Link>
      <a href="https://github.com/Kanttiinit" target="_blank"><Text id="sourceCode" /></a>
      {user && user.admin &&
      <a href="/admin" target="_blank">Admin</a>}
      &nbsp;
      <span>{version}</span>
    </footer>
  )
}

const mapState = state => ({
  user: state.data.user
})

export default connect(mapState)(Footer)
