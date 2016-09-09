import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Google from 'react-icons/lib/fa/google'
import hello from 'hellojs'

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
    const {preferences, setUseLocation, setLang, isLoggedIn, user} = this.props;
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
                hello.logout('facebook')
                hello.logout('google')
              }}><Text id="logout" /></button>
            </div>
          }
          <div style={{display: isLoggedIn ? 'none' : 'block'}} className="login-buttons">
            <button style={{background: '#3b5998'}} onClick={() => hello.login('facebook')}>
              <Facebook className="inline-icon" /><Text id="facebookLogin" />
            </button>
            <button style={{background: '#983b3b'}} onClick={() => hello.login('google')}>
              <Google className="inline-icon" /><Text id="googleLogin" />
            </button>
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
