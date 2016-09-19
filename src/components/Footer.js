import React from 'react'
import c from 'classnames'
import {connect} from 'react-redux'

import css from '../styles/Footer.scss'
import {AppLinks} from './Header'
import Text from './Text'

const Footer = ({path, token, user}) => {
  const getClassName = currentPath => c({[css.current]: path === currentPath})
  return (
    <footer className={css.container}>
      <a href="/" className={getClassName('/')}><Text id="menus" /></a>
      <a href="/contact" className={getClassName('/contact')}><Text id="contact" /></a>
      <a href="/privacy-policy" className={getClassName('/privacy-policy')}><Text id="privacyPolicy" /></a>
      <a href="/beta" className={getClassName('/beta')}>Beta</a>
      <a href="https://github.com/Kanttiinit" target="_blank"><Text id="sourceCode" /></a>
      {token && user && user.admin &&
      <a href={'https://kitchen.kanttiinit.fi/admin?token=' + token} target="_blank">Admin</a>}
      <AppLinks style={{marginTop: '2rem'}} />
    </footer>
  )
}

const mapState = state => ({
  path: state.value.view.path,
  token: state.preferences.token,
  user: state.data.user
})

export default connect(mapState)(Footer)
