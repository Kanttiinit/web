import React from 'react'
import c from 'classnames'
import {connect} from 'react-redux'

import {AppLinks} from './Header'
import Text from './Text'

const Footer = ({path}) => {
  const getClassName = currentPath => c({current: path === currentPath})
  return (
    <footer className="footer">
      <a href="/" className={getClassName('/')}><Text id="menus" /></a>
      <a href="/settings" className={getClassName('/settings')}><Text id="settings" /></a>
      <a href="/contact" className={getClassName('/contact')}><Text id="contact" /></a>
      <a href="/privacy-policy" className={getClassName('/privacy-policy')}><Text id="privacyPolicy" /></a>
      <a href="/beta" className={getClassName('/beta')}>Beta</a>
      <a href="https://github.com/Kanttiinit" target="_blank"><Text id="sourceCode" /></a>
      <AppLinks style={{marginTop: '2rem'}} />
    </footer>
  )
}

const mapState = state => ({
  path: state.value.view.path
})

export default connect(mapState)(Footer)
