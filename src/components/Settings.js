import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Google from 'react-icons/lib/fa/google'

import css from '../styles/Settings.scss'
import * as actions from '../store/actions/preferences'
import {isLoggedIn} from '../store/selectors'
import PageContainer from './PageContainer'
import Text from './Text'
import Radio from './Radio'
import AreaSelector from './Menus/AreaSelector'

const Item = ({label, children}) => (
  <div className="settings-item">
    <h2>{label}</h2>
    {children}
  </div>
)

class Settings extends React.Component {
  render() {
    const {preferences, setUseLocation, setLang, isLoggedIn, user, setToken} = this.props;
    return (
      <PageContainer title={<Text id="settings" />} className={css.container}>
        <Item label={<Text id="area" />}>
          <AreaSelector />
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
          <Radio
            options={[
              {label: 'Finnish', value: 'fi'},
              {label: 'English', value: 'en'}
            ]}
            selected={preferences.lang}
            onChange={lang => setLang(lang)} />
        </Item>
        {isBeta &&
        <Item label={<Text id="profile" />}>
          {isLoggedIn &&
            <div className={css.user}>
              <img src={user.photo} />
              <p>{user.displayName}<br /><small>{user.email}</small></p>
              <button onClick={() => setToken()}><Text id="logout" /></button>
            </div>
          }
          <div style={{display: isLoggedIn ? 'none' : 'block'}} className={css.loginButtons}>
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
        </Item>
        }
        <Item>
          <a href="/" className={css.saveButton}><Text id="save" /></a>
        </Item>
      </PageContainer>
    )
  }
}

const mapState = state => ({
  preferences: state.preferences,
  isLoggedIn: isLoggedIn(state),
  user: state.data.user
})

const mapDispatch = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapState, mapDispatch)(Settings)
