import React from 'react'
import c from 'classnames'
import {connect} from 'react-redux'

import {AppLinks} from './Header'

const Footer = ({path}) => {
  const getClassName = currentPath => c({current: path === currentPath})
  return (
    <footer className="footer">
      <a href="/" className={getClassName('/')}>Ruokalistat</a>&bull;
      <a href="/contact" className={getClassName('/contact')}>Ota yhteyttä</a>&bull;
      <a href="/privacy-policy" className={getClassName('/privacy-policy')}>Yksityisyyskäytäntö</a>&bull;
      <a href="https://github.com/Kanttiinit" target="_blank">Lähdekoodi</a>
      <AppLinks style={{marginTop: '2rem'}} />
    </footer>
  )
}

const mapState = state => ({
  path: state.value.view.path
})

export default connect(mapState)(Footer)
