import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

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
    gapi.signin2.render('g-signin2', {
      scope: 'https://www.googleapis.com/auth/plus.login',
      onsuccess: user => {
        console.log(user)
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
        <Item label="Profile">
          {isLoggedIn ?
          <div>
            <div className="user">
              <img src={user.photo} />
              <p>{user.displayName}<br /><small>{user.email}</small></p>
            </div>
            <button className="default-button" onClick={() => setAuthData()}>Logout</button>
          </div>
          :
          <div>
            <button onClick={() => facebookLogin().then(authData => setAuthData(authData))}>Login with Facebook</button>
            <div id="g-signin2" data-onsuccess="onSignIn"></div>
          </div>
          }
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
