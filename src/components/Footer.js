import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {IndexLink, Link} from 'react-router'

import Radio from './Radio'
import {setLang} from '../store/actions/preferences'
import css from '../styles/Footer.scss'
import Text from './Text'

const Footer = ({token, lang, setLang, user}) => {
  return (
    <footer className={css.container}>
      <IndexLink to="/" activeClassName={css.current}><Text id="menus" /></IndexLink>
      <Link to="/contact" activeClassName={css.current}><Text id="contact" /></Link>
      <Link to="/privacy-policy" activeClassName={css.current}><Text id="privacyPolicy" /></Link>
      <Link to="/beta" activeClassName={css.current}>Beta</Link>
      <a href="https://github.com/Kanttiinit" target="_blank"><Text id="sourceCode" /></a>
      {token && user && user.admin &&
      <a href={'/admin?token=' + token} target="_blank">Admin</a>}
      &nbsp;
      <span>{version}</span>
      <Radio
        style={{marginTop: '2rem'}}
        selected={lang}
        onChange={lang => setLang(lang)}
        options={[
          {label: 'Finnish', value: 'fi'},
          {label: 'English', value: 'en'}
        ]} />
    </footer>
  )
}

const mapState = state => ({
  token: state.preferences.token,
  user: state.data.user,
  lang: state.preferences.lang
})

const mapDispatch = dispatch => bindActionCreators({setLang}, dispatch)

export default connect(mapState, mapDispatch)(Footer)
