import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Google from 'react-icons/lib/fa/google'

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

const facebookLogin = () => new Promise((resolve, reject) => {
  FB.login(response => {
    if (response.authResponse) {
      resolve({provider: 'facebook', token: response.authResponse.accessToken})
    } else {
      reject()
    }
  });
})

class Settings extends React.Component {
  componentDidMount() {
    gapi.signin2.render('google-login', {
      longtitle: true,
      theme: 'dark',
      width: 200,
      onsuccess: user => {
        this.props.setAuthData({
          provider: 'google',
          token: user.getAuthResponse().id_token
        })
      }
    })
  }
  render() {
    const {preferences, setUseLocation, setAuthData, setLang, isLoggedIn, user} = this.props;
    return (
      <PageContainer title={<Text id="settings" />} className="settings">
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
        <Item label={<Text id="profile" />}>
          {isLoggedIn &&
            <div className="user">
              <img src={user.photo} />
              <p>{user.displayName}<br /><small>{user.email}</small></p>
              <button onClick={() => {
                gapi.load('auth2', () => {
                  const auth2 = gapi.auth2.getAuthInstance()
                  if (auth2) {
                    auth2.signOut()
                  }
                  setAuthData()
                })
              }}><Text id="logout" /></button>
            </div>
          }
          <div style={{display: isLoggedIn ? 'none' : 'block'}} className="login-buttons">
            <button style={{background: '#3b5998'}} onClick={() => facebookLogin().then(authData => setAuthData(authData))}>
              <Facebook className="inline-icon" /><Text id="facebookLogin" />
            </button>
            <div id="google-login"></div>
          </div>
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
