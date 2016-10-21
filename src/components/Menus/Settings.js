import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Google from 'react-icons/lib/fa/google'
import {Link} from 'react-router'

import http from '../../utils/http'
import css from '../../styles/Settings.scss'
import * as actions from '../../store/actions/preferences'
import {orders} from '../../store/actions/preferences'
import {fetchUser} from '../../store/actions/async'
import {isLoggedIn} from '../../store/selectors'
import Text from '../Text'
import Radio from '../Radio'

const Item = ({label, children}) => (
  <div className="settings-item">
    <h2>{label}</h2>
    {children}
  </div>
)

export const LanguageSelector = connect(
  state => ({lang: state.preferences.lang}),
  dispatch => ({setLang: lang => dispatch(actions.setLang(lang))})
)(({lang, setLang}) => (
  <Radio
    options={[
      {label: 'Finnish', value: 'fi'},
      {label: 'English', value: 'en'}
    ]}
    selected={lang}
    onChange={lang => setLang(lang)} />
))

const Settings = ({preferences, setUseLocation, setOrder, isLoggedIn, user, fetchUser}) => (
  <div className={css.container}>
    <h1><Text id="settings" /></h1>
    <Link className={css.favorites} to="/select-favorites">
      <Text id="favorites" className="button" element="button" />
    </Link>
    <Item label={<Text id="order" />}>
      <Radio
        options={orders.map(order => ({
          value: order,
          label: <Text id={order} />
        }))}
        selected={preferences.order}
        onChange={value => setOrder(value)} />
    </Item>
    <Item label={<Text id="useLocation" />}>
      <Radio
        options={[
          {label: <Text id="yes" />, value: true},
          {label: <Text id="no" />, value: false}
        ]}
        selected={preferences.useLocation}
        onChange={value => setUseLocation(value)} />
    </Item>
    <Item label={<Text id="language" />}>
      <LanguageSelector />
    </Item>
    <Item label={<Text id="profile" />}>
      {isLoggedIn ?
      <div className={css.user}>
        <img src={user.photo} />
        <p>{user.displayName}<br /><small>{user.email}</small></p>
        <button
          className="button button-small"
          style={{marginLeft: '1em'}}
          onClick={() =>
            http.get('/me/logout', true).then(() => fetchUser())
          }>
            <Text id="logout" />
          </button>
      </div>
      :
      <div className={css.loginButtons}>
        <a href={`https://www.facebook.com/dialog/oauth?client_id=1841481822746867&redirect_uri=${location.href}?facebook&response_type=token&scope=email`}>
          <button style={{background: '#3b5998'}}>
            <Facebook className="inline-icon" /><Text id="facebookLogin" />
          </button>
        </a>
        <a href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=402535393048-osrrh9uci8031oh4sv3vepgifsol0rd8.apps.googleusercontent.com&redirect_uri=${location.href}?google&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}>
          <button style={{background: '#983b3b'}}>
            <Google className="inline-icon" /><Text id="googleLogin" />
          </button>
        </a>
      </div>
      }
    </Item>
  </div>
)

const mapState = state => ({
  preferences: state.preferences,
  isLoggedIn: isLoggedIn(state),
  user: state.data.user
})

const mapDispatch = dispatch => bindActionCreators({...actions, fetchUser}, dispatch)

export default connect(mapState, mapDispatch)(Settings)
